import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  getAssets(query?: { type?: string; status?: string; search?: string }) {
    let list = [...this.prisma.memDb.assets];

    if (query?.type) {
      list = list.filter((a) => a.type.toUpperCase() === query.type.toUpperCase());
    }
    if (query?.status) {
      list = list.filter((a) => a.authorizationStatus.toUpperCase() === query.status.toUpperCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.target.toLowerCase().includes(q) ||
          (a.scopeDescription && a.scopeDescription.toLowerCase().includes(q)),
      );
    }

    return list;
  }

  getAssetById(id: string) {
    const asset = this.prisma.memDb.assets.find((a) => a.id === id);
    if (!asset) throw new NotFoundException('Asset not found');

    const relatedAlerts = this.prisma.memDb.alerts.filter((a) => a.assetId === asset.id);
    const relatedIncidents = this.prisma.memDb.incidents.filter((i) => i.assetId === asset.id);

    return {
      ...asset,
      alerts: relatedAlerts,
      incidents: relatedIncidents,
      canScan: asset.authorizationStatus === 'AUTHORIZED',
    };
  }

  createAsset(data: any, actor: string = 'Super Admin') {
    if (!data.name || !data.target || !data.type) {
      throw new BadRequestException('Asset name, target, and type are required.');
    }

    const newAsset = {
      id: 'ast-' + Date.now(),
      name: data.name,
      type: data.type.toUpperCase(),
      target: data.target,
      ownerName: data.ownerName || actor,
      authorizationStatus: data.authorizationProof ? 'AUTHORIZED' : 'PENDING_VERIFICATION',
      authorizationProof: data.authorizationProof || null,
      scopeDescription: data.scopeDescription || 'Enterprise monitored perimeter asset.',
      riskStatus: 'LOW',
      lastAssessmentAt: null,
      tags: data.tags || ['Perimeter', 'Production'],
      createdAt: new Date().toISOString(),
    };

    this.prisma.memDb.assets.push(newAsset);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'ASSET_REGISTERED',
      targetResource: `Asset ${newAsset.name} (${newAsset.target})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { authorized: newAsset.authorizationStatus === 'AUTHORIZED' },
    });

    return newAsset;
  }

  verifyAuthorization(id: string, proofDocumentId: string, actor: string = 'Super Admin') {
    const asset = this.prisma.memDb.assets.find((a) => a.id === id);
    if (!asset) throw new NotFoundException('Asset not found');

    asset.authorizationStatus = 'AUTHORIZED';
    asset.authorizationProof = proofDocumentId;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'ASSET_AUTHORIZATION_VERIFIED',
      targetResource: `Asset ${asset.name} (${asset.target})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { proofDocumentId },
    });

    return asset;
  }
}

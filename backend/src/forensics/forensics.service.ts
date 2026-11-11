import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForensicsService {
  constructor(private readonly prisma: PrismaService) {}

  getCases() {
    return this.prisma.memDb.forensicCases;
  }

  getCaseById(id: string) {
    const c = this.prisma.memDb.forensicCases.find((cs) => cs.id === id || cs.caseNumber === id);
    if (!c) throw new NotFoundException('Forensic case not found');

    const evidenceList = this.prisma.memDb.evidence.filter((e) => e.caseNumber === c.caseNumber);
    return {
      ...c,
      evidence: evidenceList,
    };
  }

  getEvidence(caseNumber?: string) {
    let list = [...this.prisma.memDb.evidence];
    if (caseNumber) {
      list = list.filter((e) => e.caseNumber === caseNumber);
    }
    return list;
  }

  getChainOfCustody(evidenceNumber?: string) {
    let list = [...this.prisma.memDb.chainOfCustody];
    if (evidenceNumber) {
      list = list.filter((c) => c.evidenceNumber === evidenceNumber);
    }
    return list;
  }

  createCase(data: any, actor: string = 'Marcus Brooks') {
    if (!data.title) throw new BadRequestException('Case title is required.');

    const caseNumber = `DFC-2026-${String(this.prisma.memDb.forensicCases.length + 14).padStart(4, '0')}`;
    const newCase = {
      id: 'dfc-' + Date.now(),
      caseNumber,
      title: data.title,
      description: data.description || 'Forensic digital investigation into security incident.',
      status: 'ACTIVE',
      priority: data.priority || 'P1_HIGH',
      leadInvestigatorName: data.leadInvestigator || actor,
      incidentCode: data.incidentCode || null,
      evidenceCount: 0,
      findingsSummary: null,
      openedAt: new Date().toISOString(),
    };

    this.prisma.memDb.forensicCases.unshift(newCase);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SECURITY_ADMIN',
      action: 'FORENSIC_CASE_OPENED',
      targetResource: `Case ${caseNumber}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { title: data.title, incidentCode: data.incidentCode },
    });

    return newCase;
  }

  addEvidence(data: any, actor: string = 'Elena Rostova') {
    if (!data.caseNumber || !data.name || !data.sha256Hash) {
      throw new BadRequestException('Case number, evidence name, and SHA-256 cryptographic hash are required.');
    }

    const evidenceNumber = `EVD-2026-${String(this.prisma.memDb.evidence.length + 91).padStart(4, '0')}`;
    const newEvidence = {
      id: 'evd-' + Date.now(),
      evidenceNumber,
      caseNumber: data.caseNumber,
      name: data.name,
      evidenceType: data.evidenceType || 'Disk Image',
      sha256Hash: data.sha256Hash,
      md5Hash: data.md5Hash || null,
      fileSizeBytes: data.fileSizeBytes || 1048576,
      storageLocation: data.storageLocation || `vault://forensics/${data.caseNumber}/${evidenceNumber}.img`,
      collectorName: actor,
      collectedAt: new Date().toISOString(),
      notes: data.notes || 'Securely preserved digital evidence.',
    };

    this.prisma.memDb.evidence.push(newEvidence);

    // Initial Chain of Custody Record
    this.prisma.memDb.chainOfCustody.push({
      evidenceNumber,
      actor,
      action: 'COLLECTION & SECURE HASHING',
      purpose: 'Initial acquisition under forensic compliance',
      timestamp: new Date().toISOString(),
    });

    // Update case evidence counter
    const c = this.prisma.memDb.forensicCases.find((cs) => cs.caseNumber === data.caseNumber);
    if (c) c.evidenceCount = (c.evidenceCount || 0) + 1;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SECURITY_ADMIN',
      action: 'EVIDENCE_CATALOGED',
      targetResource: `Evidence ${evidenceNumber} (Case ${data.caseNumber})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { sha256: data.sha256Hash },
    });

    return newEvidence;
  }

  addCustodyAction(evidenceNumber: string, action: string, purpose: string, actor: string = 'Marcus Brooks') {
    const record = {
      evidenceNumber,
      actor,
      action: action.toUpperCase(),
      purpose,
      timestamp: new Date().toISOString(),
    };

    this.prisma.memDb.chainOfCustody.push(record);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SECURITY_ADMIN',
      action: 'CHAIN_OF_CUSTODY_UPDATED',
      targetResource: `Evidence ${evidenceNumber}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { custodyAction: action, purpose },
    });

    return record;
  }
}

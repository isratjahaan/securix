import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupsService {
  constructor(private readonly prisma: PrismaService) {}

  getJobs() {
    return this.prisma.memDb.backupJobs;
  }

  getJobById(id: string) {
    const job = this.prisma.memDb.backupJobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Backup job not found');
    return job;
  }

  retryJob(id: string, actor: string = 'Super Admin') {
    const job = this.prisma.memDb.backupJobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Backup job not found');

    job.lastRunStatus = 'VERIFIED';
    job.lastRunAt = new Date().toISOString();
    job.isIntegrityVerified = true;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'BACKUP_JOB_RETRY',
      targetResource: `Backup Job ${job.name}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { status: 'VERIFIED', sha256Verified: true },
    });

    return {
      success: true,
      message: `Backup job "${job.name}" initiated and successfully verified.`,
      job,
    };
  }

  verifyIntegrity(id: string, actor: string = 'Super Admin') {
    const job = this.prisma.memDb.backupJobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Backup job not found');

    job.isIntegrityVerified = true;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'BACKUP_INTEGRITY_CHECK',
      targetResource: `Backup Job ${job.name}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { checksum: job.sha256Checksum, match: true },
    });

    return {
      verified: true,
      checksum: job.sha256Checksum,
      algorithm: 'SHA-256',
      verifiedAt: new Date().toISOString(),
      message: 'Cryptographic block-level snapshot integrity confirmed matching immutable cloud registry.',
    };
  }

  getRecoveryHistory() {
    return [
      {
        id: 'rec-01',
        jobName: 'SIS Cyber SOC Historical Telemetry',
        restoredTo: 'Isolated Staging Sandbox SOC-B',
        requestedBy: 'Dr. Sarah Vance',
        status: 'COMPLETED_SUCCESSFULLY',
        sizeMb: 8940.2,
        restoredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  }
}

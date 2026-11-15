import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { EventBusService } from '../src/events/event-bus.service';
import { ThreatDetectedEvent } from '../src/events/security-events';
import { PrismaService } from '../src/prisma/prisma.service';

describe('SIS CYBER FORTRESS — Modular Ecosystem & Event Bus Verification', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let eventBus: EventBusService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    eventBus = app.get(EventBusService);
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Phase 1: Decoupled Internal Event Bus', () => {
    it('should successfully emit and deduplicate events via EventBusService', () => {
      const fixedEventId = `test-evt-dedup-${Date.now()}`;
      const event = new ThreatDetectedEvent({
        eventId: fixedEventId,
        sourceModuleId: 'sis-threat-intel',
        sourceModuleName: 'SIS Threat Intelligence Engine',
        threatType: 'MALICIOUS_IOC',
        severity: 'HIGH',
        title: 'C2 Probing Activity Detected',
        description: 'Simulated C2 beacon detected on perimeter gateway',
        targetEntity: '198.51.100.42',
      });

      // First emission must succeed
      const firstResult = eventBus.publishThreat(event);
      expect(firstResult).toBe(true);

      // Duplicate emission with the same eventId must be intercepted and suppressed
      const duplicateResult = eventBus.publishThreat(event);
      expect(duplicateResult).toBe(false);
    });

    it('should ingest published threats into central alerts and audit logs', async () => {
      const uniqueId = `test-threat-${Date.now()}`;
      eventBus.publishThreat(
        new ThreatDetectedEvent({
          eventId: uniqueId,
          sourceModuleId: 'sis-webshield',
          sourceModuleName: 'SIS Web Shield',
          threatType: 'SQL_INJECTION',
          severity: 'CRITICAL',
          title: 'Automated Event Ingestion Verification',
          description: 'Testing cross-module decoupled event bus ingestion',
          targetEntity: '/api/v1/checkout',
        }),
      );

      // Wait briefly for asynchronous event listener processing
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Verify alert was stored in central repository
      const matchingAlert = prisma.memDb.alerts.find((a: any) => a.title === 'Automated Event Ingestion Verification');
      expect(matchingAlert).toBeDefined();
      expect(matchingAlert?.severity).toBe('CRITICAL');
      expect(matchingAlert?.threatCategory).toBe('SQL_INJECTION');

      // Verify audit log entry was appended
      const matchingAudit = prisma.memDb.auditLogs.find(
        (l: any) => l.action === 'THREAT_ALERT_GENERATED' && l.details?.eventId === uniqueId,
      );
      expect(matchingAudit).toBeDefined();
    });
  });

  describe('Phase 2: Independent Module Boundaries', () => {
    describe('SIS Phishing Shield (/api/phishing/*)', () => {
      it('POST /api/phishing/scan - should detect credential harvesting phishing URL', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/phishing/scan')
          .send({
            target: 'http://login-verify-account-update.xyz/auth/login.php',
            type: 'URL',
          })
          .expect(201);

        expect(res.body.verdict).toBe('MALICIOUS');
        expect(res.body.threatScore).toBeGreaterThanOrEqual(75);
        expect(res.body.quarantined).toBe(true);
        expect(res.body.indicators.length).toBeGreaterThan(0);
      });

      it('POST /api/phishing/scan - should classify legitimate domain as benign', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/phishing/scan')
          .send({
            target: 'https://cyberfortress.enterprise.sis/docs',
            type: 'URL',
          })
          .expect(201);

        expect(res.body.verdict).toBe('SAFE');
        expect(res.body.threatScore).toBeLessThan(50);
        expect(res.body.quarantined).toBe(false);
      });

      it('GET /api/phishing/quarantine - should return quarantined artifacts', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/phishing/quarantine')
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
      });

      it('GET /api/phishing/statistics - should return operational telemetry', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/phishing/statistics')
          .expect(200);

        expect(res.body.totalScanned).toBeGreaterThan(0);
        expect(res.body.accuracyRatePercent).toBeDefined();
      });
    });

    describe('SIS Ransomware Guardian (/api/ransomware/*)', () => {
      it('GET /api/ransomware/canaries - should list active honeypot decoy files', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/ransomware/canaries')
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(3);
        const canary = res.body[0];
        expect(canary.id).toBeDefined();
        expect(canary.path).toBeDefined();
        expect(canary.status).toBe('INTACT');
      });

      it('POST /api/ransomware/tripwires/test - should simulate canary mutation and dispatch SOC alert', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/ransomware/tripwires/test')
          .send({
            canaryId: 'CANARY-FINANCE-01',
            simulatedEntropy: 8.24,
          })
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.alertDispatched).toBe(true);
        expect(res.body.canaryStatus).toBe('MUTATED');

        // Verify SOC alert generated
        const alert = prisma.memDb.alerts.find((a: any) => a.threatCategory === 'RANSOMWARE_CANARY_TRIPWIRE');
        expect(alert).toBeDefined();
        expect(alert?.severity).toBe('CRITICAL');
      });

      it('GET /api/ransomware/entropy - should return storage Shannon entropy telemetry', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/ransomware/entropy')
          .expect(200);

        expect(res.body.baselineEntropy).toBeDefined();
        expect(res.body.currentThreshold).toBeDefined();
        expect(res.body.algorithm).toContain('Shannon');
      });

      it('POST /api/ransomware/isolate-host - should isolate infected endpoint', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/ransomware/isolate-host')
          .send({
            hostIdentifier: '10.0.12.88',
            reason: 'High entropy write burst detected by tripwire sensor',
          })
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.networkState).toBe('QUARANTINED_ISOLATED');
        expect(res.body.isolatedHost).toBe('10.0.12.88');
      });
    });
  });

  describe('Phase 3: Runtime Active Module Guard (@RequireActiveModule)', () => {
    it('should allow access to active module endpoints (HTTP 200)', async () => {
      // Both phishing and ransomware start active
      await request(app.getHttpServer())
        .get('/api/phishing/statistics')
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/ransomware/statistics')
        .expect(200);
    });

    it('should return structured HTTP 503 Service Unavailable when module is DISABLED', async () => {
      // 1. Disable SIS Phishing Shield
      await request(app.getHttpServer())
        .post('/api/modules/sis-phishing/disable')
        .send({ force: true })
        .expect(201);

      // Verify module status is DISABLED in registry
      const mod = prisma.memDb.modules.find((m: any) => m.id === 'sis-phishing');
      expect(mod?.status).toBe('DISABLED');

      // 2. Request to disabled module must be intercepted with HTTP 503
      const blockedRes = await request(app.getHttpServer())
        .get('/api/phishing/statistics')
        .expect(503);

      expect(blockedRes.body.statusCode).toBe(503);
      expect(blockedRes.body.error).toBe('Service Unavailable');
      expect(blockedRes.body.moduleId).toBe('sis-phishing');
      expect(blockedRes.body.moduleStatus).toBe('DISABLED');
      expect(blockedRes.body.message).toContain('DISABLED');

      // Invariant: Unrelated active modules MUST continue functioning unaffected
      const ransomwareRes = await request(app.getHttpServer())
        .get('/api/ransomware/statistics')
        .expect(200);

      expect(ransomwareRes.body.canariesDeployed).toBeDefined();

      // Zero Data Loss invariant: Re-enabling module restores service without data corruption
      await request(app.getHttpServer())
        .post('/api/modules/sis-phishing/enable')
        .expect(201);

      const restoredRes = await request(app.getHttpServer())
        .get('/api/phishing/statistics')
        .expect(200);

      expect(restoredRes.body.totalScanned).toBeGreaterThan(0);
    });

    it('should return HTTP 503 Service Unavailable when module is in MAINTENANCE mode', async () => {
      // Put SIS Ransomware Guardian into MAINTENANCE mode
      await request(app.getHttpServer())
        .post('/api/modules/sis-ransomware/maintenance')
        .send({ enabled: true })
        .expect(201);

      const blockedRes = await request(app.getHttpServer())
        .get('/api/ransomware/statistics')
        .expect(503);

      expect(blockedRes.body.statusCode).toBe(503);
      expect(blockedRes.body.moduleId).toBe('sis-ransomware');
      expect(blockedRes.body.moduleStatus).toBe('MAINTENANCE');

      // Restore module from maintenance
      await request(app.getHttpServer())
        .post('/api/modules/sis-ransomware/maintenance')
        .send({ enabled: false })
        .expect(201);

      await request(app.getHttpServer())
        .get('/api/ransomware/statistics')
        .expect(200);
    });
  });
});

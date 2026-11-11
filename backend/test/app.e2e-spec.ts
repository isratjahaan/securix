import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SIS CYBER FORTRESS — End-to-End Enterprise System Verification', () => {
  jest.setTimeout(30000);
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Authentication & RBAC Gateways', () => {
    it('POST /api/auth/login - should issue MFA challenge or JWT for Super Admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'sarah.vance@fortress.sis.enterprise',
          password: 'Fortress2026!',
        })
        .expect(200);

      expect(res.body).toBeDefined();
      if (res.body.mfaRequired) {
        expect(res.body.tempToken).toBeDefined();
        // Step 2: Verify TOTP
        const mfaRes = await request(app.getHttpServer())
          .post('/api/auth/mfa/verify')
          .send({
            tempToken: res.body.tempToken,
            code: '123456',
          })
          .expect(200);

        authToken = mfaRes.body.accessToken;
      } else {
        authToken = res.body.accessToken;
      }

      expect(authToken).toBeDefined();
    });

    it('POST /api/auth/login - should reject invalid credentials with 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'sarah.vance@fortress.sis.enterprise',
          password: 'WrongPassword!',
        })
        .expect(401);
    });
  });

  describe('2. 12-in-1 Ecosystem Module Management', () => {
    it('GET /api/modules - should return exactly all 12 cybersecurity modules', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/modules')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(12);

      const moduleIds = res.body.map((m: any) => m.id);
      expect(moduleIds).toContain('sis-identity');
      expect(moduleIds).toContain('sis-phishing');
      expect(moduleIds).toContain('sis-endpoint');
      expect(moduleIds).toContain('sis-network');
      expect(moduleIds).toContain('sis-vault');
      expect(moduleIds).toContain('sis-ransomware');
      expect(moduleIds).toContain('sis-webshield');
      expect(moduleIds).toContain('sis-forensics');
      expect(moduleIds).toContain('sis-access');
      expect(moduleIds).toContain('sis-threat-intel');
      expect(moduleIds).toContain('sis-cloud-backup');
      expect(moduleIds).toContain('sis-cyber-soc');
    });

    it('GET /api/modules/dependencies - should construct directed dependency graph', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/modules/dependencies')
        .expect(200);

      expect(res.body.nodes).toBeDefined();
      expect(res.body.links).toBeDefined();
      expect(res.body.nodes.length).toBe(12);
    });

    it('GET /api/modules/:id/disable-impact - should evaluate downstream consequences before disable', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/modules/sis-threat-intel/disable-impact')
        .expect(200);

      expect(res.body.moduleId).toBe('sis-threat-intel');
      expect(res.body.activeDependents.length).toBeGreaterThan(0);
      expect(res.body.consequences).toContain('degrade or disrupt');
    });
  });

  describe('3. SOC Operations & Incident Lifecycle', () => {
    let testAlertId: string;
    let testIncidentId: string;

    it('GET /api/soc/overview - should return real calculated SOC metrics', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/soc/overview')
        .expect(200);

      expect(res.body.totalAlerts).toBeGreaterThanOrEqual(1);
      expect(res.body.mttdMinutes).toBeDefined();
      expect(res.body.mttcMinutes).toBeDefined();
    });

    it('GET /api/soc/alerts - should filter alerts and list active items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/soc/alerts')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      testAlertId = res.body[0].id;
    });

    it('POST /api/soc/alerts/:id/acknowledge - should transition alert state', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/soc/alerts/${testAlertId}/acknowledge`)
        .expect(201);

      expect(res.body.status).toBe('ACKNOWLEDGED');
    });

    it('POST /api/soc/incidents - should declare and escalate formal incident', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/soc/incidents')
        .send({
          title: 'Automated E2E Test Threat Escalation',
          description: 'Simulated multi-vector probing payload verified in integration sandbox.',
          priority: 'P1_HIGH',
          moduleId: 'sis-cyber-soc',
        })
        .expect(201);

      expect(res.body.incidentCode).toMatch(/^INC-2026-\d{4}$/);
      expect(res.body.status).toBe('NEW');
      testIncidentId = res.body.id;
    });

    it('PATCH /api/soc/incidents/:id/status - should advance lifecycle to INVESTIGATING and RESOLVED', async () => {
      const res1 = await request(app.getHttpServer())
        .patch(`/api/soc/incidents/${testIncidentId}/status`)
        .send({ status: 'INVESTIGATING' })
        .expect(200);
      expect(res1.body.status).toBe('INVESTIGATING');

      const res2 = await request(app.getHttpServer())
        .patch(`/api/soc/incidents/${testIncidentId}/status`)
        .send({ status: 'RESOLVED', resolutionSummary: 'E2E test successfully mitigated' })
        .expect(200);
      expect(res2.body.status).toBe('RESOLVED');
    });
  });

  describe('4. Zero-Knowledge Vault Privacy Invariant', () => {
    it('GET /api/vault/metadata - should confirm active zero-knowledge policy and NO plaintexts', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/vault/metadata')
        .expect(200);

      expect(res.body.zeroKnowledgePolicy).toBe('ACTIVE_AND_ENFORCED');
      expect(res.body.storageEncryptedAlgorithm).toContain('AES-256-GCM');
      // Invariant: no password or secret key fields in payload
      expect(res.body.password).toBeUndefined();
      expect(res.body.privateKey).toBeUndefined();
      expect(res.body.backdoor).toBeUndefined();
    });
  });

  describe('5. Cloud Backup Integrity', () => {
    it('POST /api/backups/jobs/:id/verify - should verify SHA-256 block-level checksum', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/backups/jobs/bkj-001/verify')
        .expect(201);

      expect(res.body.verified).toBe(true);
      expect(res.body.checksum).toBeDefined();
      expect(res.body.algorithm).toBe('SHA-256');
    });
  });

  describe('6. Verified System and Database Health', () => {
    it('GET /api/health/system - should return authentic process and memory health', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/health/system')
        .expect(200);

      expect(res.body.backendStatus).toBe('HEALTHY');
      expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(res.body.memoryUsageMb).toBeGreaterThan(0);
      expect(res.body.databaseStatus).toBeDefined();
    });

    it('GET /api/health/database - should report actual database connection state', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/health/database')
        .expect(200);

      expect(res.body.databaseType).toBe('PostgreSQL 16.2');
      expect(res.body.replicaMode).toBeDefined();
    });
  });
});

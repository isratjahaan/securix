import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACTIVE_MODULE_KEY = 'REQUIRE_ACTIVE_MODULE_KEY';

/**
 * Decorator to enforce runtime active state check for an enterprise cybersecurity module.
 * If the module is DISABLED or in MAINTENANCE mode, requests are intercepted with HTTP 503 Service Unavailable.
 *
 * @param moduleId Unique canonical identifier of the module (e.g. 'sis-phishing', 'sis-ransomware')
 */
export const RequireActiveModule = (moduleId: string) => SetMetadata(REQUIRE_ACTIVE_MODULE_KEY, moduleId);

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Permissions } from '../guards/permissions';
import { FAKE_DATA_HOST } from '../interceptors/fake-data.interceptor';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasPermission', () => {
    function hasPermission(requestPermission: Permissions, userPermissions: Permissions[], expectedResult: boolean) {
      it(`should return '${expectedResult}' when asking for '${requestPermission}' when user has [${userPermissions.join(',')}]`, () => {
        service.hasPermission(requestPermission).subscribe((result) => {
          expect(result).toBe(expectedResult);
        });

        httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`).forEach((req) => {
          req.flush({ permissions: userPermissions });
        });
      });
    }

    hasPermission(Permissions.ReadCommands, [Permissions.ReadCommands], true);
    hasPermission(Permissions.ReadCommands, [], false);
    hasPermission(Permissions.ReadCommands, [Permissions.ReadBot], false);
  });

  describe('hasAnyPermission', () => {
    function hasAnyPermission(
      requestPermissions: Permissions[],
      userPermissions: Permissions[],
      expectedResult: boolean,
    ) {
      it(`should return '${expectedResult}' when asking for [${requestPermissions.join(',')}] when user has [${userPermissions.join(',')}]`, () => {
        service.hasAnyPermission(...requestPermissions).subscribe((result) => {
          expect(result).toBe(expectedResult);
        });

        httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`).forEach((req) => {
          req.flush({ permissions: userPermissions });
        });
      });
    }

    hasAnyPermission([Permissions.ReadCommands], [Permissions.ReadCommands], true);
    hasAnyPermission([Permissions.ReadCommands], [], false);
    hasAnyPermission([Permissions.ReadCommands], [Permissions.ReadBot], false);
    hasAnyPermission([Permissions.ReadCommands, Permissions.ReadBot], [Permissions.ReadBot], true);
    hasAnyPermission([Permissions.ReadCommands, Permissions.ReadBot], [], false);
  });

  describe('hasAllPermissions', () => {
    function hasAllPermissions(
      requestPermissions: Permissions[],
      userPermissions: Permissions[],
      expectedResult: boolean,
    ) {
      it(`should return '${expectedResult}' when asking for [${requestPermissions.join(',')}] when user has [${userPermissions.join(',')}]`, () => {
        service.hasAllPermissions(...requestPermissions).subscribe((result) => {
          expect(result).toBe(expectedResult);
        });

        httpTestingController.match(`${FAKE_DATA_HOST}/api/v2/user/me`).forEach((req) => {
          req.flush({ permissions: userPermissions });
        });
      });
    }

    hasAllPermissions([Permissions.ReadCommands], [Permissions.ReadCommands], true);
    hasAllPermissions([Permissions.ReadCommands], [], false);
    hasAllPermissions([Permissions.ReadCommands], [Permissions.ReadBot], false);
    hasAllPermissions([Permissions.ReadCommands, Permissions.ReadBot], [Permissions.ReadBot], false);
    hasAllPermissions([Permissions.ReadCommands, Permissions.ReadBot], [], false);
    hasAllPermissions(
      [Permissions.ReadCommands, Permissions.ReadBot],
      [Permissions.ReadBot, Permissions.ReadCommands],
      true,
    );
  });
});

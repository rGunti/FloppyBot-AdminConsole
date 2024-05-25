import { HasAnyPermissionPipe } from './has-any-permission.pipe';

describe('HasAnyRolePipe', () => {
  it('create an instance', () => {
    const pipe = new HasAnyPermissionPipe();
    expect(pipe).toBeTruthy();
  });
});

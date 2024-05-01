import { ListPipe } from './list.pipe';

describe('ListPipe', () => {
  let pipe: ListPipe;

  beforeEach(() => {
    pipe = new ListPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns a comma-separated list', () => {
    expect(pipe.transform(['a', 'b', 'c'])).toBe('a, b, c');
  });
});

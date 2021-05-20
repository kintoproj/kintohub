import { k8sMemoryFormatToMB } from '../../../libraries/helpers/service';

describe('k8sMemoryFormatToMB', () => {
  it('should return the correct memory in MB', () => {
    // https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
    const testCases = ['128974848', '129M', '123Mi'];

    const expected = 123;
    for (let i = 0; i < testCases.length; i++) {
      expect(k8sMemoryFormatToMB(testCases[i])).toEqual(expected);
    }
  });
});

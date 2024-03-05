import SonicBoom from 'sonic-boom';

export default () => {
  return new SonicBoom({ dest: '/var/log/sleepr.error.log' });
}

import { Inject } from '@nestjs/common';
import { UnitOfWork } from '../unit-of-work';

export function Transactional() {
  const injector = Inject(UnitOfWork);

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    injector(target, 'unitOfWork');
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const service: UnitOfWork = this.unitOfWork;
      return service.transactional(() => originalMethod.apply(this, args));
    };
  };
}

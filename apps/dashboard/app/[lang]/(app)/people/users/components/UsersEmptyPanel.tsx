import { PeopleContextPanel } from '../../../components/people/shared';
import type { UsersDetailPanelCopy } from '../page.types';

type UsersEmptyPanelProps = {
  copy: UsersDetailPanelCopy['empty'];
};

export function UsersEmptyPanel({ copy }: UsersEmptyPanelProps) {
  return (
    <PeopleContextPanel
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
    />
  );
}

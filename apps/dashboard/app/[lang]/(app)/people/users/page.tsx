import PeopleUsersPageController from './page.controller';
import { resolveUsersPageMode, USERS_PAGE_QUERY_KEYS } from './page.copy';

type PeopleUsersPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const getSingleQueryValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default function PeopleUsersPage({ searchParams = {} }: PeopleUsersPageProps) {
  const initialSelectedUserClientId = getSingleQueryValue(
    searchParams[USERS_PAGE_QUERY_KEYS.selected] ??
      searchParams[USERS_PAGE_QUERY_KEYS.legacySelected]
  )?.trim();

  const initialMode = resolveUsersPageMode(
    getSingleQueryValue(searchParams[USERS_PAGE_QUERY_KEYS.mode]),
    initialSelectedUserClientId
  );

  return (
    <PeopleUsersPageController
      initialMode={initialMode}
      initialSelectedUserClientId={initialSelectedUserClientId || undefined}
    />
  );
}

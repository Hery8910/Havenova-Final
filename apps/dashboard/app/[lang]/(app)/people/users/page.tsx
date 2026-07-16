import PeopleUsersPageController from './page.controller';
import { parseUsersSearchState, resolveUsersPageMode, USERS_PAGE_QUERY_KEYS } from './page.copy';

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
  const initialSearchState = parseUsersSearchState({
    search: getSingleQueryValue(searchParams[USERS_PAGE_QUERY_KEYS.search]),
    status: getSingleQueryValue(searchParams[USERS_PAGE_QUERY_KEYS.status]),
  });

  const initialSelectedValue = getSingleQueryValue(searchParams[USERS_PAGE_QUERY_KEYS.selected])?.trim();
  const initialLegacyUserClientId = getSingleQueryValue(
    searchParams[USERS_PAGE_QUERY_KEYS.legacySelected]
  )?.trim();
  const initialSelectedEntryId =
    initialSelectedValue || (initialLegacyUserClientId ? `user:${initialLegacyUserClientId}` : undefined);

  const initialMode = resolveUsersPageMode(
    getSingleQueryValue(searchParams[USERS_PAGE_QUERY_KEYS.mode]),
    initialSelectedEntryId
  );

  return (
    <PeopleUsersPageController
      initialMode={initialMode}
      initialSearchState={initialSearchState}
      initialSelectedEntryId={initialSelectedEntryId || undefined}
    />
  );
}

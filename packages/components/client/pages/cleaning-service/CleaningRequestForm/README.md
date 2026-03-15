# Cleaning Request Form

## Purpose

This form collects the frontend draft for a cleaning service request in four sequential steps:

1. customer type and recurrence
2. property details
3. preferred first visit slot
4. service/work address

The current implementation does not submit the request to the backend yet.
It builds the final frontend payload shape that will be sent later.

## Data Sources

### Client configuration

Read from the existing client source through `ClientContext` and `useClientCalendarSettings()`:

- `clientId`
- `schedule`
- `slotDurationMinutes`

### User profile

Read from the existing profile source through `ProfileContext` and `useProfile()`:

- `primaryAddress`
- `savedAddresses`
- `language`
- `theme`

When the user chooses to save a newly entered work address, the parent page merges it into
`profile.savedAddresses` and updates the profile using the working profile endpoint.

## Step Flow

### Step 1: Customer and Frequency

Collected fields:

```ts
{
  customerType: 'private' | 'business';
}
```

Cleaning-specific details start in the next step.

### Step 2: Property Details

Collected fields:

```ts
{
  details: {
    frequency: 'once' | 'two_per_month' | 'three_per_month' | 'weekly';
    property: {
      sizeRange: 'under_50' | '50_80' | '80_120' | 'over_120';
      roomsCount: number;
      hasBalcony: boolean;
      hasIndoorStairs: boolean;
      hasPets: boolean;
      details?: string;
    };
  }
}
```

### Step 3: Availability Selection

Collected fields:

```ts
{
  preferredVisitSlot: {
    start: Date;
    end: Date;
  };
}
```

These are concrete date-time boundaries for the selected first visit interval.

Availability rules:

- the frontend generates valid slots from the client weekly schedule
- the backend only provides blocked slots for the visible month
- if blocked slots are missing, valid schedule slots are treated as available
- only dates from tomorrow onward are selectable

### Step 4: Work Address Selection

Collected fields:

```ts
{
  workAddress: {
    address: {
      street: string;
      streetNumber: string;
      postalCode: string;
      district: string;
      floor?: string;
    };
    source: 'primary' | 'saved' | 'new';
    saveToProfile?: boolean;
    label?: string;
  };
}
```

Supported address scenarios:

- use the current profile `primaryAddress`
- use one of the profile `savedAddresses`
- enter a new address manually

If the user enters a new address, the component may emit:

```ts
{
  saveToProfile: true,
  label?: string
}
```

This is only an intent flag. The component does not persist profile changes itself.

## Final Frontend Submission Shape

The form currently emits this object to the parent page:

```ts
interface CleaningRequestFormSubmission {
  customerType: 'private' | 'business';
  details: {
    frequency: 'once' | 'two_per_month' | 'three_per_month' | 'weekly';
    property: {
      sizeRange: 'under_50' | '50_80' | '80_120' | 'over_120';
      roomsCount: number;
      hasBalcony: boolean;
      hasIndoorStairs: boolean;
      hasPets: boolean;
      details?: string;
    };
  };
  preferredVisitSlot: {
    start: Date;
    end: Date;
  };
  workAddress: {
    address: {
      street: string;
      streetNumber: string;
      postalCode: string;
      district: string;
      floor?: string;
    };
    source: 'primary' | 'saved' | 'new';
    saveToProfile?: boolean;
    label?: string;
  };
}
```

## Current Parent Flow

The parent page currently:

1. receives `CleaningRequestFormSubmission`
2. optionally checks whether `workAddress.source === 'new'` and `saveToProfile === true`
3. if so, merges that address into `profile.savedAddresses`
4. updates the user profile through `updateProfile(...)` as a separate application side effect
5. leaves the final request POST as a TODO

## Important Separation of Concerns

- `AvailabilityCalendar` only visualizes and selects preferred visit slots
- `WorkAddressSelector` only selects and emits the structured work address
- profile persistence for new saved addresses is handled separately by the parent page
- the formal service request submission contract does not include profile update data
- final service request persistence is still pending

## Pending Backend Domain Work

The request domain that receives this data should expect, at minimum:

- root-level `customerType`
- cleaning request details
- preferred first visit slot as concrete `Date` boundaries
- structured work address plus lightweight `source` metadata

Profile updates for newly saved addresses remain outside the request contract and should be
handled as an application side effect or orchestration concern.

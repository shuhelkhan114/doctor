export interface Patient {
  id: string;
  name: string;
  imageUrl: string;
  careTeamMembersCount: number;
  peopleHasAccessCount: number;
  healthIssuesCount: number;
}

export interface MedicationItem {
  name: string;
  status: 'Approved' | 'Experimental' | 'Illicit';
}

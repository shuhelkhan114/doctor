import { fhirInstance } from '@core/lib/axios';
import { CareTeamResponse, PractitionerResponse } from '@typings/api-responses/fhir/doctor';
import { HealthIssuesResponse } from '@typings/api-responses/fhir/healthIssue';
import { MedicationStatementResponse } from '@typings/api-responses/fhir/medication';

export const getMedications = async (patientId: string) => {
  const searchRes = await fhirInstance
    .get<MedicationStatementResponse>(`/DSTU2/MedicationStatement?patient=${patientId}`)
    .then((res) => res.data);

  const results = searchRes.entry
    .filter((entry) => entry.resource.resourceType === 'MedicationStatement')
    .map((entry) => {
      const dosage = entry.resource.dosage?.map((dose) => ({
        unit: '',
        value: dose.text,
      }))[0];

      return {
        id: entry.resource.id as string,
        name: (entry.resource as any).medicationCodeableConcept?.text as string,
        dosageUnit: dosage?.unit as string,
        dosageAmount: dosage?.value as unknown as number,
      };
    });

  return results;
};

export const getDoctors = async (patientId: string) => {
  const searchRes = await fhirInstance
    .get<CareTeamResponse>(`/R4/CareTeam?patient=${patientId}`)
    .then((res) => res.data);

  const doctors = await Promise.all(
    searchRes.entry
      .filter((entry) => entry.resource.resourceType === 'CareTeam')
      .map((entry) =>
        fhirInstance
          .get<PractitionerResponse>(`/R4/${entry.resource.participant?.[0].member.reference}`)
          .then((res) => ({
            ...res.data,
            speciality: entry.resource.participant?.[0]?.role?.[0]?.text as string,
          }))
      )
  );

  return doctors.map((doctor) => {
    return {
      id: doctor.id,
      imageUrl: doctor.photo?.[0].url,
      name: doctor.name?.[0].given?.join(' ') + ' ' + doctor.name?.[0].family,
      npiNumber: doctor.identifier?.[0].value,
      speciality: doctor.speciality,
    };
  });
};

export const getHealthIssues = async (patientId: string) => {
  const searchRes = await fhirInstance
    .get<HealthIssuesResponse>(`/R4/Condition?patient=${patientId}`)
    .then((res) => res.data);

  const results = searchRes.entry
    .filter((entry) => entry.resource.resourceType === 'List')
    .map((entry) => ({
      id: entry.resource.id as string,
      name: entry.resource.entry?.map((entry) => entry.item.display).join(', ') as string,
    }));
  return results;
};

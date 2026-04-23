export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  scope: string;
  image: string;
  caseStudy: {
    challenge: string;
    solution: string;
    results: string[];
  };
};

export type Job = {
  id: string;
  title: string;
  summary: string;
  department: string;
  location: string;
  type: string;
  description: string;
  active: boolean;
  createdAt: string;
  requirements?: string[];
};

export type ApplicantRanking = {
  id: string;
  score: number | null;
  comments: string | null;
  fitsRoles: string | null;
  doesNotFit: string | null;
  _count: { applications: number };
};

export type Application = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  linkedin: string;
  portfolio: string;
  message: string;
  cvFileName?: string;
  submittedAt: string;
  job?: { id: string; title: string } | null;
  applicant?: ApplicantRanking | null;
};

// Grouped applicant types (used by admin applications page)
export type ApplicationEntry = {
  id: string;
  role: string;
  submittedAt: string;
  cvFileName?: string | null;
  message?: string | null;
  phone: string;
  linkedin?: string | null;
  portfolio?: string | null;
  job?: { id: string; title: string } | null;
  currentlyEmployed?: boolean | null;
  noticePeriod?: string | null;
  yearsOfExperience?: string | null;
  location?: string | null;
  bimSoftware?: string | null;
};

export type GroupedApplicant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  score: number | null;
  comments: string | null;
  fitsRoles: string | null;
  doesNotFit: string | null;
  applications: ApplicationEntry[];
};

export type CompanyContactRanking = {
  id: string;
  score: number | null;
  comments: string | null;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  service?: string | null;
  projectServices?: string | null;
  message: string;
  submittedAt: string;
  companyContact?: CompanyContactRanking | null;
};

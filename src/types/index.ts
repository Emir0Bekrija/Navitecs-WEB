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
  department: string;
  location: string;
  type: string;
  description: string;
  active: boolean;
  createdAt: string;
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
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  message: string;
  submittedAt: string;
};

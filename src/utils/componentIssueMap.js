export const COMPONENT_ISSUE_MAP = {
  Ban: ['Bocor', 'Aus', 'Tekanan Rendah', 'Benjol', 'Retak'],
  Mesin: ['Overheating', 'Oli Bocor', 'Getaran Abnormal', 'Suara Kasar', 'Starter Lemah'],
  Rem: ['Bunyi Abnormal', 'Kampas Aus', 'Tekanan Rendah', 'Blong', 'Drag'],
  Lampu: ['Mati', 'Redup', 'Koneksi Bermasalah', 'Kedip Tidak Normal'],
  Suspensi: ['Getaran', 'Aus', 'Tidak Stabil', 'Bunyi Berisik', 'Keropos'],
  Transmisi: ['Slip', 'Suara Kasar', 'Perpindahan Gigi Berat', 'Oli Bocor'],
  Aki: ['Lemah', 'Korslet', 'Terminal Kotor', 'Tidak Mengisi'],
  Pendingin: ['Bocor', 'Radiator Tersumbat', 'Kipas Rusak', 'Coolant Habis'],
  'Sistem Bahan Bakar': ['Filter Tersumbat', 'Pompa Lemah', 'Injector Kotor', 'Kebocoran'],
  Kelistrikan: ['Konsleting', 'Sensor Rusak', 'ECU Error', 'Wiring Putus'],
}

export const COMPONENTS = Object.keys(COMPONENT_ISSUE_MAP)

export const getIssuesForComponent = (component) => {
  return COMPONENT_ISSUE_MAP[component] || []
}

export const isValidIssueForComponent = (component, issue) => {
  const validIssues = COMPONENT_ISSUE_MAP[component] || []
  return validIssues.includes(issue)
}

export const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Rendah — Tidak mengganggu operasional' },
  { value: 'medium', label: 'Sedang — Perlu perhatian dalam 1 minggu' },
  { value: 'high', label: 'Tinggi — Perlu penanganan segera' },
  { value: 'critical', label: 'Kritis — Bahaya untuk beroperasi' },
]

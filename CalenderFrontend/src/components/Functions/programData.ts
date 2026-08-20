export const SKED_BASE = "https://sked.lin.hs-osnabrueck.de/sked/grp/";

export type ProgramCategory = "Praxisintegrierend" | "Berufsintegrierend";

export interface ProgramOption {
    category: ProgramCategory;
    year: number;
    label: string;
    code: string;
}

// Source: https://intranet.hs-osnabrueck.de/infothek/fakultaet-mkt/institut-fuer-duale-studiengaenge/stundenplaene-des-ids/
// A few entries from that page were left out because their group code was
// missing, ambiguous, or contradicted another entry (e.g. GSV specializations
// without a code, a duplicated 26BTS1-EAT row, a mistyped Berufsintegrierend
// 2025 "Steuern" code).
export const PROGRAM_OPTIONS: ProgramOption[] = [
    // Praxisintegrierend 2022
    { category: "Praxisintegrierend", year: 2022, label: "Pflege (Dual)", code: "22DPD1" },

    // Praxisintegrierend 2023
    { category: "Praxisintegrierend", year: 2023, label: "Multiprofessionelle Gesundheits- und Sozialversorgung", code: "23GSV1" },
    { category: "Praxisintegrierend", year: 2023, label: "Pflege (Dual)", code: "23DPD1" },

    // Praxisintegrierend 2024
    { category: "Praxisintegrierend", year: 2024, label: "Engineering technischer Systeme - Chemische Prozesstechnik/Verfahrenstechnik", code: "24BTS-CPV" },
    { category: "Praxisintegrierend", year: 2024, label: "Engineering technischer Systeme - Elektrotechnik/Automatisierungstechnik", code: "24BTS-EAT" },
    { category: "Praxisintegrierend", year: 2024, label: "Engineering technischer Systeme - Maschinenbau", code: "24BTS-MAS" },
    { category: "Praxisintegrierend", year: 2024, label: "Engineering technischer Systeme - Mechatronik", code: "24BTS-MEC" },
    { category: "Praxisintegrierend", year: 2024, label: "Engineering technischer Systeme - Technische Informatik", code: "24BTS-TIN" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Controlling", code: "24DNB-CON" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Human Resource Management", code: "24DNB-HRM" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Logistik", code: "24DNB-LOG" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Marketing", code: "24DNB-MAR" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Steuern", code: "24DNB3-STE" },
    { category: "Praxisintegrierend", year: 2024, label: "Betriebswirtschaft und nachhaltiges Management - Unternehmensführung", code: "24DNB-UNF" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsinformatik und nachhaltige IT - E-Business", code: "24DNI-EBU" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsinformatik und nachhaltige IT - IT-Beratung und Marketing", code: "24DNI-IBM" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsinformatik und nachhaltige IT - Informationsmanagement", code: "24DNI-IMA" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsinformatik und nachhaltige IT - IT-Infrastrukturmanagement", code: "24DNI-ITI" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsinformatik und nachhaltige IT - Produktionsinformatik", code: "24DNI-PDI" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung - Produktmanagement", code: "24DNE-PDM" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung - Projektmanagement", code: "24DNE-PRM" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung - Produktionsmanagement", code: "24DNE-PSM" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung - Technisches Controlling", code: "24DNE-TCN" },
    { category: "Praxisintegrierend", year: 2024, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung - Vertriebsmanagement", code: "24DNE-VTM" },
    { category: "Praxisintegrierend", year: 2024, label: "Pflege (Dual)", code: "24DPD1" },

    // Praxisintegrierend 2025
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Elektrotechnik/Automatisierungstechnik (Kohorte 1)", code: "25BTS1-EAT" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Maschinenbau (Kohorte 1)", code: "25BTS1-MAS" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Mechatronik (Kohorte 1)", code: "25BTS1-MEC" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Technische Informatik (Kohorte 1)", code: "25BTS1-TIN" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Chemische Prozesstechnik/Verfahrenstechnik (Kohorte 2)", code: "25BTS2-CPV" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Elektrotechnik/Automatisierungstechnik (Kohorte 2)", code: "25BTS2-EAT" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Maschinenbau (Kohorte 2)", code: "25BTS2-MAS" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Mechatronik (Kohorte 2)", code: "25BTS2-MEC" },
    { category: "Praxisintegrierend", year: 2025, label: "Engineering technischer Systeme - Technische Informatik (Kohorte 2)", code: "25BTS2-TIN" },
    { category: "Praxisintegrierend", year: 2025, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 1)", code: "25DNB1" },
    { category: "Praxisintegrierend", year: 2025, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 2)", code: "25DNB2" },
    { category: "Praxisintegrierend", year: 2025, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 3)", code: "25DNB3" },
    { category: "Praxisintegrierend", year: 2025, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 4)", code: "25DNB4" },
    { category: "Praxisintegrierend", year: 2025, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung (Gruppe 1)", code: "25DNE1" },
    { category: "Praxisintegrierend", year: 2025, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung (Gruppe 2)", code: "25DNE2" },
    { category: "Praxisintegrierend", year: 2025, label: "Wirtschaftsinformatik und nachhaltige IT (Gruppe 2)", code: "25DNI2" },
    { category: "Praxisintegrierend", year: 2025, label: "Pflege (Dual)", code: "25DPD1" },

    // Praxisintegrierend 2026
    { category: "Praxisintegrierend", year: 2026, label: "Engineering technischer Systeme - Maschinenbau (Kohorte 1)", code: "26BTS1-MAS" },
    { category: "Praxisintegrierend", year: 2026, label: "Engineering technischer Systeme - Mechatronik (Kohorte 1)", code: "26BTS1-MEC" },
    { category: "Praxisintegrierend", year: 2026, label: "Engineering technischer Systeme - Technische Informatik (Kohorte 1)", code: "26BTS1-TIN" },
    { category: "Praxisintegrierend", year: 2026, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 1)", code: "26DNB-1" },
    { category: "Praxisintegrierend", year: 2026, label: "Betriebswirtschaft und nachhaltiges Management (Gruppe 2)", code: "26DNB-2" },
    { category: "Praxisintegrierend", year: 2026, label: "Wirtschaftsingenieurwesen und nachhaltige Entwicklung (Gruppe 1)", code: "26DNE1" },
    { category: "Praxisintegrierend", year: 2026, label: "Wirtschaftsinformatik und nachhaltige IT (Gruppe 2)", code: "26DNI2" },

    // Berufsintegrierend 2023
    { category: "Berufsintegrierend", year: 2023, label: "Management betrieblicher Systeme - Betriebswirtschaft (Controlling)", code: "23BBSB-CON" },
    { category: "Berufsintegrierend", year: 2023, label: "Management betrieblicher Systeme - Betriebswirtschaft (Marketing)", code: "23BBSB-MAR" },
    { category: "Berufsintegrierend", year: 2023, label: "Management betrieblicher Systeme - Betriebswirtschaft (Steuern)", code: "23BBSB-STE" },
    { category: "Berufsintegrierend", year: 2023, label: "Management betrieblicher Systeme - Betriebswirtschaft (Unternehmensführung)", code: "23BBSB-UNF" },
    { category: "Berufsintegrierend", year: 2023, label: "Management betrieblicher Systeme - Wirtschaftsingenieurwesen (Projektingenieur)", code: "23BBSW-PRI" },

    // Berufsintegrierend 2024
    { category: "Berufsintegrierend", year: 2024, label: "Management betrieblicher Systeme - Betriebswirtschaft", code: "24BBS-B" },
    { category: "Berufsintegrierend", year: 2024, label: "Management betrieblicher Systeme - Betriebswirtschaft (Steuern)", code: "24BBS-STE" },
    { category: "Berufsintegrierend", year: 2024, label: "Management betrieblicher Systeme - Wirtschaftsingenieurwesen", code: "24BBS-W" },

    // Berufsintegrierend 2025
    { category: "Berufsintegrierend", year: 2025, label: "Management betrieblicher Systeme - Betriebswirtschaft", code: "25BBS-B" },
    { category: "Berufsintegrierend", year: 2025, label: "Management betrieblicher Systeme - Wirtschaftsingenieurwesen", code: "25BBS-W" },

    // Berufsintegrierend 2026
    { category: "Berufsintegrierend", year: 2026, label: "Management betrieblicher Systeme - Betriebswirtschaft", code: "26BBS-B" },
    { category: "Berufsintegrierend", year: 2026, label: "Management betrieblicher Systeme - Wirtschaftsingenieurwesen", code: "26BBS-W" },
];

export const CATEGORIES: ProgramCategory[] = ["Praxisintegrierend", "Berufsintegrierend"];

export function yearsForCategory(category: ProgramCategory): number[] {
    return [...new Set(PROGRAM_OPTIONS.filter(o => o.category === category).map(o => o.year))].sort();
}

export function optionsFor(category: ProgramCategory, year: number): ProgramOption[] {
    return PROGRAM_OPTIONS.filter(o => o.category === category && o.year === year);
}

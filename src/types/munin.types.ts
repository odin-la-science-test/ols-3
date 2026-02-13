// Munin Atlas Type Definitions

export interface Property {
    value: string;
    link?: string; // Optional link to property detail page
    description?: string;
}

export interface CrossReference {
    id: string;
    name: string;
    link: string;
    description?: string;
}

export interface Entity {
    id: string;
    name: string;
    category: string;
    overview: string;
    image?: string;
    properties: {
        [key: string]: Property | string;
    };
    relatedEntities?: CrossReference[];
    additionalInfo?: {
        [key: string]: string | string[];
    };
}

export interface PropertyDefinition {
    id: string;
    name: string;
    description: string;
    types?: string[];
    relatedConcepts?: string[];
}

export interface DisciplineData {
    discipline: string;
    displayName: string;
    description: string;
    entities: Entity[];
    properties: PropertyDefinition[];
}

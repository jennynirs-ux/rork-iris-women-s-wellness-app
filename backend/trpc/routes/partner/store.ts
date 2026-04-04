import logger from "../../../lib/logger";
import * as persistence from "../persistence";
import crypto from "crypto";

export interface SharedPartnerData {
  phase: string;
  phaseDay: number;
  totalCycleDays: number;
  mood: number | null;
  energy: number | null;
  lastUpdated: string;
}

export interface PartnerLink {
  userId: string;
  partnerCode: string;
  linkedPartnerId: string | null;
  sharedData: SharedPartnerData;
  createdAt: string;
}

interface PartnerStoreData {
  partnerLinks: [string, PartnerLink][];
  partnerCodeToUserId: [string, string][];
}

const storedData = persistence.load<PartnerStoreData>('partner-links.json') || {
  partnerLinks: [],
  partnerCodeToUserId: [],
};

const partnerLinks = new Map<string, PartnerLink>(storedData.partnerLinks);
const partnerCodeToUserId = new Map<string, string>(storedData.partnerCodeToUserId);

function getOrCreatePartnerLink(userId: string): PartnerLink {
  let link = partnerLinks.get(userId);
  if (!link) {
    link = {
      userId,
      partnerCode: generateCode(),
      linkedPartnerId: null,
      sharedData: {
        phase: "unknown",
        phaseDay: 0,
        totalCycleDays: 0,
        mood: null,
        energy: null,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };
    partnerLinks.set(userId, link);
    persistPartnerStore();
  }
  return link;
}

function generateCode(): string {
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
  return `IRIS-${randomPart}`;
}

function generatePartnerCode(userId: string): string {
  const link = getOrCreatePartnerLink(userId);
  if (link.partnerCode && partnerCodeToUserId.get(link.partnerCode) === userId) {
    return link.partnerCode;
  }
  const newCode = generateCode();
  link.partnerCode = newCode;
  partnerCodeToUserId.set(newCode, userId);
  persistPartnerStore();
  return newCode;
}

function linkPartner(userId: string, partnerCode: string): { success: boolean; error?: string } {
  const partnerId = partnerCodeToUserId.get(partnerCode.toUpperCase());
  if (!partnerId) {
    return { success: false, error: "invalid_code" };
  }

  if (partnerId === userId) {
    return { success: false, error: "cannot_link_self" };
  }

  const userLink = getOrCreatePartnerLink(userId);
  const partnerLink = getOrCreatePartnerLink(partnerId);

  userLink.linkedPartnerId = partnerId;
  partnerLink.linkedPartnerId = userId;

  persistPartnerStore();
  logger.log("[PartnerStore] Linked users:", userId, "and", partnerId);

  return { success: true };
}

function unlinkPartner(userId: string): void {
  const userLink = partnerLinks.get(userId);
  if (userLink && userLink.linkedPartnerId) {
    const partnerId = userLink.linkedPartnerId;
    userLink.linkedPartnerId = null;

    const partnerLink = partnerLinks.get(partnerId);
    if (partnerLink) {
      partnerLink.linkedPartnerId = null;
    }

    persistPartnerStore();
    logger.log("[PartnerStore] Unlinked users:", userId, "and", partnerId);
  }
}

function updateSharedData(userId: string, data: Partial<SharedPartnerData>): void {
  const link = getOrCreatePartnerLink(userId);
  link.sharedData = {
    ...link.sharedData,
    ...data,
    lastUpdated: new Date().toISOString(),
  };
  persistPartnerStore();
  logger.log("[PartnerStore] Updated shared data for user:", userId);
}

function getPartnerData(userId: string): SharedPartnerData | null {
  const link = partnerLinks.get(userId);
  if (!link || !link.linkedPartnerId) {
    return null;
  }

  const partnerLink = partnerLinks.get(link.linkedPartnerId);
  if (!partnerLink) {
    return null;
  }

  return partnerLink.sharedData;
}

function getPartnerLink(userId: string): PartnerLink | null {
  return partnerLinks.get(userId) || null;
}

function persistPartnerStore(): void {
  const data: PartnerStoreData = {
    partnerLinks: Array.from(partnerLinks.entries()),
    partnerCodeToUserId: Array.from(partnerCodeToUserId.entries()),
  };
  persistence.save('partner-links.json', data);
}

export const partnerStore = {
  generatePartnerCode,
  linkPartner,
  unlinkPartner,
  updateSharedData,
  getPartnerData,
  getPartnerLink,
  getOrCreatePartnerLink,
};

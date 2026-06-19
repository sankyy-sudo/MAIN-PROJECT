import { Op, WhereOptions } from "sequelize";
import { User } from "../../../models/User";
import { ILead, Lead, LeadStatus } from "../models/Lead";
import { LeadActivity, LeadActivityType } from "../models/LeadActivity";

interface LeadQuery {
  search?: string;
  status?: LeadStatus;
  source?: string;
  assignedTo?: string;
}

const userFields = ["id", "name", "email", "role"];

export class LeadService {
  async createLead(data: Partial<ILead>) {
    const lead = await Lead.create(data as any);

    await LeadActivity.create({
      lead: lead.id,
      type: LeadActivityType.NOTE,
      message: "Lead created",
      createdBy: data.assignedTo
    });

    return lead;
  }

  async getLeads(page: number, limit: number, query: LeadQuery = {}) {
    const where: WhereOptions = {};

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query.search}%` } },
          { company: { [Op.iLike]: `%${query.search}%` } },
          { email: { [Op.iLike]: `%${query.search}%` } }
        ]
      });
    }
    if (query.status) Object.assign(where, { status: query.status });
    if (query.source) Object.assign(where, { source: query.source });
    if (query.assignedTo) Object.assign(where, { assignedTo: query.assignedTo });

    const { rows, count } = await Lead.findAndCountAll({
      where,
      include: [{ model: User, as: "assignedUser", attributes: userFields }],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit
    });

    const leads = rows.map((lead) => {
      const value = lead.toJSON() as any;
      value.assignedTo = value.assignedUser || value.assignedTo;
      delete value.assignedUser;
      return value;
    });

    return { leads, total: count, page, limit };
  }

  async getLeadById(id: string) {
    return Lead.findByPk(id);
  }

  async updateLead(id: string, data: Partial<ILead>, actorId?: string) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;

    const previousStatus = lead.status;
    await lead.update(data);

    if (data.status && previousStatus !== data.status) {
      await LeadActivity.create({
        lead: id,
        type: LeadActivityType.STATUS_CHANGE,
        message: `Status changed from ${previousStatus} to ${data.status}`,
        createdBy: actorId
      });
    }

    return lead;
  }

  async deleteLead(id: string) {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;
    await lead.destroy();
    return lead;
  }

  async getLeadTimeline(id: string) {
    return LeadActivity.findAll({
      where: { lead: id },
      include: [{ model: User, as: "creator", attributes: userFields }],
      order: [["createdAt", "DESC"]]
    });
  }

  async addLeadActivity(
    id: string,
    data: { type?: LeadActivityType; message: string; createdBy?: string }
  ) {
    return LeadActivity.create({
      lead: id,
      type: data.type || LeadActivityType.NOTE,
      message: data.message,
      createdBy: data.createdBy
    });
  }
}

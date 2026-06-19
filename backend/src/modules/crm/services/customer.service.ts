import { User } from "../../../models/User";
import { Customer, ICustomer } from "../models/Customer";
import {
  CustomerActivity,
  CustomerActivityType
} from "../models/CustomerActivity";

const creatorInclude = {
  model: User,
  as: "creator",
  attributes: ["id", "name", "email", "role"]
};

export class CustomerService {
  async createCustomer(data: Partial<ICustomer>) {
    const customer = await Customer.create(data as any);

    await CustomerActivity.create({
      customer: customer.id,
      type: CustomerActivityType.UPDATE,
      title: "Customer created"
    });

    return customer;
  }

  async getCustomers(page: number, limit: number) {
    const { rows, count } = await Customer.findAndCountAll({
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit
    });

    return { customers: rows, total: count, page, limit };
  }

  async getCustomerById(id: string) {
    return Customer.findByPk(id);
  }

  async updateCustomer(id: string, data: Partial<ICustomer>) {
    const customer = await Customer.findByPk(id);
    return customer ? customer.update(data) : null;
  }

  async deleteCustomer(id: string) {
    const customer = await Customer.findByPk(id);
    if (!customer) return null;
    await customer.destroy();
    return customer;
  }

  async getCustomerTimeline(id: string) {
    return CustomerActivity.findAll({
      where: { customer: id },
      include: [creatorInclude],
      order: [["createdAt", "DESC"]]
    });
  }

  async addCustomerNote(
    id: string,
    data: { title: string; description?: string; createdBy?: string }
  ) {
    return CustomerActivity.create({
      customer: id,
      type: CustomerActivityType.NOTE,
      title: data.title,
      description: data.description,
      createdBy: data.createdBy
    });
  }

  async addCustomerDocument(
    id: string,
    data: {
      title: string;
      documentUrl: string;
      description?: string;
      createdBy?: string;
    }
  ) {
    return CustomerActivity.create({
      customer: id,
      type: CustomerActivityType.DOCUMENT,
      title: data.title,
      description: data.description,
      documentUrl: data.documentUrl,
      createdBy: data.createdBy
    });
  }
}

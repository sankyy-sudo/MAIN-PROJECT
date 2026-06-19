import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";

const service = new CustomerService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class CustomerController {
  async createCustomer(
    req: Request,
    res: Response
  ) {
    const customer =
      await service.createCustomer(req.body);

    return res.status(201).json({
      success: true,
      data: customer
    });
  }

  async getCustomers(
    req: Request,
    res: Response
  ) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await service.getCustomers(
      page,
      limit
    );

    return res.json({
      success: true,
      data: result
    });
  }

  async getCustomerById(
    req: Request,
    res: Response
  ) {
    const customer =
      await service.getCustomerById(
        getParamId(req.params.id)
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.json({
      success: true,
      data: customer
    });
  }

  async updateCustomer(
    req: Request,
    res: Response
  ) {
    const customer =
      await service.updateCustomer(
        getParamId(req.params.id),
        req.body
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.json({
      success: true,
      data: customer
    });
  }

  async deleteCustomer(
    req: Request,
    res: Response
  ) {
    const customer =
      await service.deleteCustomer(
        getParamId(req.params.id)
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.json({
      success: true,
      message: "Customer deleted successfully"
    });
  }

  async getCustomerTimeline(
    req: Request,
    res: Response
  ) {
    const timeline =
      await service.getCustomerTimeline(
        getParamId(req.params.id)
      );

    return res.json({
      success: true,
      data: timeline
    });
  }

  async addCustomerNote(
    req: Request,
    res: Response
  ) {
    const note =
      await service.addCustomerNote(
        getParamId(req.params.id),
        {
          title: req.body.title,
          description: req.body.description,
          createdBy: req.user?.id
        }
      );

    return res.status(201).json({
      success: true,
      data: note
    });
  }

  async addCustomerDocument(
    req: Request,
    res: Response
  ) {
    const document =
      await service.addCustomerDocument(
        getParamId(req.params.id),
        {
          title: req.body.title,
          documentUrl: req.body.documentUrl,
          description: req.body.description,
          createdBy: req.user?.id
        }
      );

    return res.status(201).json({
      success: true,
      data: document
    });
  }
}

export const customerController =
  new CustomerController();

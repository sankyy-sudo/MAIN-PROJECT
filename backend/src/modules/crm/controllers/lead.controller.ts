import {
 Request,
 Response
} from "express";

import {
 LeadService
}
from "../services/lead.service";
import { LeadStatus } from "../models/Lead";
import { LeadActivityType } from "../models/LeadActivity";

const service =
 new LeadService();

const getParamId = (id: string | string[]) =>
 Array.isArray(id) ? id[0] : id;

export class LeadController {

 async createLead(
  req:Request,
  res:Response
 ){
  const lead =
   await service.createLead(
    req.body
   );

  res.status(201)
  .json({
   success:true,
   data:lead
  });
 }

 async getLeads(
  req:Request,
  res:Response
 ){

  const page =
   Number(
    req.query.page
   ) || 1;

  const limit =
   Number(
    req.query.limit
   ) || 10;

  const result =
   await service.getLeads(
    page,
    limit,
    {
     search:
      req.query.search as string | undefined,
     status:
      req.query.status as LeadStatus | undefined,
     source:
      req.query.source as string | undefined,
     assignedTo:
      req.query.assignedTo as string | undefined
    }
   );

  res.json({
   success:true,
   data:result
  });
 }

 async getLeadById(
  req:Request,
  res:Response
 ){
  const lead =
   await service.getLeadById(
    getParamId(req.params.id)
   );

  if (!lead) {
   return res.status(404).json({
    success:false,
    message:"Lead not found"
   });
  }

  return res.json({
   success:true,
   data:lead
  });
 }

 async updateLead(
  req:Request,
  res:Response
 ){
  const lead =
   await service.updateLead(
    getParamId(req.params.id),
    req.body,
    req.user?.id
   );

  if (!lead) {
   return res.status(404).json({
    success:false,
    message:"Lead not found"
   });
  }

  return res.json({
   success:true,
   data:lead
  });
 }

 async deleteLead(
  req:Request,
  res:Response
 ){
  const lead =
   await service.deleteLead(
    getParamId(req.params.id)
   );

  if (!lead) {
   return res.status(404).json({
    success:false,
    message:"Lead not found"
   });
  }

  return res.json({
   success:true,
   message:"Lead deleted successfully"
  });
 }

 async getLeadTimeline(
  req:Request,
  res:Response
 ){
  const timeline =
   await service.getLeadTimeline(
    getParamId(req.params.id)
   );

  return res.json({
   success:true,
   data:timeline
  });
 }

 async addLeadActivity(
  req:Request,
  res:Response
 ){
  const activity =
   await service.addLeadActivity(
    getParamId(req.params.id),
    {
     type:req.body.type as LeadActivityType,
     message:req.body.message,
     createdBy:req.user?.id
    }
   );

  return res.status(201).json({
   success:true,
   data:activity
  });
 }
}

export const leadController =
 new LeadController();

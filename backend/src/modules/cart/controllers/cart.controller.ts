import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const service = new CartService();

const sessionFromRequest = (req: Request) =>
  (req.headers["x-cart-session-id"] as string | undefined) ||
  (req.cookies.cartSessionId as string | undefined);
const param = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export class CartController {
  async current(req: Request, res: Response) {
    const cart = await service.getOrCreateCart(
      req.user?.id,
      sessionFromRequest(req)
    );
    const data = await service.getCartWithItems(cart.id);
    res.cookie("cartSessionId", cart.sessionId, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.json({ success: true, data: { cart: data } });
  }

  async add(req: Request, res: Response) {
    try {
      const cart = await service.getOrCreateCart(
        req.user?.id,
        sessionFromRequest(req)
      );
      const data = await service.addItem(
        cart.id,
        req.body.productId,
        Number(req.body.quantity)
      );
      res.cookie("cartSessionId", cart.sessionId, {
        httpOnly: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.status(201).json({ success: true, data: { cart: data } });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const cart = await service.getOrCreateCart(
        req.user?.id,
        sessionFromRequest(req)
      );
      const data = await service.updateItem(
        cart.id,
        param(req.params.id),
        Number(req.body.quantity)
      );
      return res.json({ success: true, data: { cart: data } });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async remove(req: Request, res: Response) {
    const cart = await service.getOrCreateCart(
      req.user?.id,
      sessionFromRequest(req)
    );
    const data = await service.removeItem(cart.id, param(req.params.id));
    return res.json({ success: true, data: { cart: data } });
  }

  async clear(req: Request, res: Response) {
    const cart = await service.getOrCreateCart(
      req.user?.id,
      sessionFromRequest(req)
    );
    const data = await service.clearCart(cart.id);
    return res.json({ success: true, data: { cart: data } });
  }

  async merge(req: Request, res: Response) {
    const data = await service.mergeGuestCart(sessionFromRequest(req), req.user!.id);
    return res.json({ success: true, data: { cart: data } });
  }
}

export const cartController = new CartController();

import { Op, WhereOptions } from "sequelize";
import { AcademyWaitlist } from "../models/AcademyWaitlist";
import { Banner, BannerPlacement, BannerPortal } from "../models/Banner";
import { CmsPage, PageType } from "../models/CmsPage";
import { ContentPost, ContentPostType } from "../models/ContentPost";
import { SiteSetting, SiteSettingGroup } from "../models/SiteSetting";

const asBoolean = (value: unknown, fallback = false) =>
  value === undefined ? fallback : value === true || value === "true";

export class CmsService {
  async listBanners(query: {
    portal?: BannerPortal;
    placement?: BannerPlacement;
    activeOnly?: boolean;
  }) {
    const where: WhereOptions = {};
    if (query.portal) Object.assign(where, { portal: query.portal });
    if (query.placement) Object.assign(where, { placement: query.placement });
    if (query.activeOnly) {
      const now = new Date();
      Object.assign(where, {
        isActive: true,
        [Op.and]: [
          { [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }] },
          { [Op.or]: [{ endsAt: null }, { endsAt: { [Op.gte]: now } }] }
        ]
      });
    }
    return Banner.findAll({ where, order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
  }

  createBanner(data: Partial<Banner>) {
    return Banner.create({
      ...data,
      isActive: asBoolean(data.isActive, true),
      sortOrder: Number(data.sortOrder || 0)
    } as any);
  }

  async updateBanner(id: string, data: Partial<Banner>) {
    const banner = await Banner.findByPk(id);
    return banner ? banner.update(data as any) : null;
  }

  async deleteBanner(id: string) {
    const banner = await Banner.findByPk(id);
    if (!banner) return null;
    await banner.destroy();
    return banner;
  }

  async listPages(query: { type?: PageType; publishedOnly?: boolean }) {
    const where: WhereOptions = {};
    if (query.type) Object.assign(where, { type: query.type });
    if (query.publishedOnly) Object.assign(where, { isPublished: true });
    return CmsPage.findAll({ where, order: [["updatedAt", "DESC"]] });
  }

  getPageBySlug(slug: string, publishedOnly = false) {
    return CmsPage.findOne({
      where: {
        slug: slug.toLowerCase(),
        ...(publishedOnly ? { isPublished: true } : {})
      }
    });
  }

  createPage(data: Partial<CmsPage>) {
    return CmsPage.create({
      ...data,
      isPublished: asBoolean(data.isPublished)
    } as any);
  }

  async updatePage(id: string, data: Partial<CmsPage>) {
    const page = await CmsPage.findByPk(id);
    return page ? page.update(data as any) : null;
  }

  async deletePage(id: string) {
    const page = await CmsPage.findByPk(id);
    if (!page) return null;
    await page.destroy();
    return page;
  }

  async listPosts(query: { type?: ContentPostType; publishedOnly?: boolean }) {
    const where: WhereOptions = {};
    if (query.type) Object.assign(where, { type: query.type });
    if (query.publishedOnly) Object.assign(where, { isPublished: true });
    return ContentPost.findAll({ where, order: [["publishedAt", "DESC"], ["createdAt", "DESC"]] });
  }

  getPostBySlug(slug: string, publishedOnly = false) {
    return ContentPost.findOne({
      where: {
        slug: slug.toLowerCase(),
        ...(publishedOnly ? { isPublished: true } : {})
      }
    });
  }

  createPost(data: Partial<ContentPost>) {
    const isPublished = asBoolean(data.isPublished);
    return ContentPost.create({
      ...data,
      isPublished,
      publishedAt: data.publishedAt || (isPublished ? new Date() : null)
    } as any);
  }

  async updatePost(id: string, data: Partial<ContentPost>) {
    const post = await ContentPost.findByPk(id);
    if (!post) return null;
    const isPublishing = data.isPublished === true && !post.publishedAt;
    return post.update({
      ...data,
      publishedAt: data.publishedAt || (isPublishing ? new Date() : post.publishedAt)
    } as any);
  }

  async deletePost(id: string) {
    const post = await ContentPost.findByPk(id);
    if (!post) return null;
    await post.destroy();
    return post;
  }

  createWaitlistEntry(data: Partial<AcademyWaitlist>) {
    return AcademyWaitlist.create(data as any);
  }

  listWaitlist() {
    return AcademyWaitlist.findAll({ order: [["createdAt", "DESC"]] });
  }

  async upsertSetting(group: SiteSettingGroup, key: string, value: string) {
    const [setting] = await SiteSetting.findOrCreate({
      where: { group, key },
      defaults: { group, key, value }
    });
    if (setting.value !== value) await setting.update({ value });
    return setting;
  }

  listSettings(group?: SiteSettingGroup) {
    return SiteSetting.findAll({
      where: group ? { group } : {},
      order: [["group", "ASC"], ["key", "ASC"]]
    });
  }
}

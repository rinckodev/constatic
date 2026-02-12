import { changelog, getPageImage } from "@lib/source";
import { notFound } from "next/navigation";
import { generateOGImage } from "./og";

export const revalidate = false;

export async function GET(
	_req: Request,
	{ params }: RouteContext<"/[lang]/og/changelog/[...slug]">,
) {
	const { slug } = await params;
	const page = changelog.getPage(slug.slice(0, -1));
	if (!page) notFound();

	const { title, description, icon } = page.data;

	return generateOGImage({
		title, description, icon,
		site: "Constatic"
	});
}

export function generateStaticParams() {
	return changelog.getPages().map((page) => ({
		lang: page.locale,
		slug: [...getPageImage(page).segments, "image.png"],
	}));
}

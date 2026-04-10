import { getContext } from "svelte";
import Root from "./direction.svelte";

export type Direction = "ltr" | "rtl";

export function getDirection(defaultDirection: Direction = "ltr"): Direction {
	const getter = getContext<(() => Direction) | undefined>("direction");
	return getter?.() ?? defaultDirection;
}

export {
	Root,
	//
	Root as DirectionProvider,
};

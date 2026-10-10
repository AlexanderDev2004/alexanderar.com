// Inline SVG icon renderer. Path bodies come from src/data/icons.json, which
// scripts/generate-icons.mjs extracts from the @iconify-json collections at
// build time — replacing the iconify-icon web component, which loaded a
// render-blocking script from code.iconify.design and fetched each icon from
// the Iconify API at runtime.
//
// Sizes and colors match the old component: 1em × 1em, currentColor.
import type { SVGProps } from 'react';
import bodies from '../data/icons.json';

const registry = bodies as Record<string, string>;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export function Icon({ name, ...rest }: IconProps) {
  const body = registry[name];
  if (!body) return null;
  return (
    <svg
      className="icon"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
      {...rest}
    />
  );
}

// Navigation structure with 3-level hierarchy: Main > Category > SubCategory

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavCategory {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

export interface NavMenu {
  label: string;
  href: string;
  categories?: NavCategory[];
}

export const mainNavigation: NavMenu[] = [
  {
    label: "NEW IN",
    href: "/collections/new-arrivals",
    categories: [
      {
        label: "Men",
        href: "/collections/new-men",
        subItems: [
          { label: "Stitched Kurtas", href: "/collections/new-men-kurtas" },
          { label: "Shalwar Kameez", href: "/collections/new-men-kameez" },
          { label: "Unstitched Fabric", href: "/collections/new-men-fabric" },
        ],
      },
      {
        label: "Women",
        href: "/collections/new-women",
        subItems: [
          { label: "Stitched Suits", href: "/collections/new-women-suits" },
          { label: "Unstitched Fabric", href: "/collections/new-women-fabric" },
          { label: "Ready to Wear", href: "/collections/new-women-pret" },
        ],
      },
      {
        label: "Kids",
        href: "/collections/new-kids",
        subItems: [
          { label: "Boys Eastern", href: "/collections/new-boys-eastern" },
          { label: "Girls Eastern", href: "/collections/new-girls-eastern" },
        ],
      },
    ],
  },
  {
    label: "MEN",
    href: "/pages/mens-clothing",
    categories: [
      {
        label: "Eastern Wear",
        href: "/collections/mens-eastern",
        subItems: [
          { label: "Shalwar Kameez", href: "/collections/mens-kameez" },
          { label: "Kurtas", href: "/collections/mens-kurtas" },
          { label: "Waistcoats", href: "/collections/mens-waistcoats" },
          { label: "Unstitched Fabric", href: "/collections/mens-fabric" },
        ],
      },
      {
        label: "Western Wear",
        href: "/collections/mens-western",
        subItems: [
          { label: "Shirts", href: "/collections/mens-shirts" },
          { label: "Trousers", href: "/collections/mens-trousers" },
          { label: "T-Shirts", href: "/collections/mens-tshirts" },
        ],
      },
      {
        label: "Winter Wear",
        href: "/collections/mens-winter",
        subItems: [
          { label: "Sweaters", href: "/collections/mens-sweaters" },
          { label: "Jackets", href: "/collections/mens-jackets" },
        ],
      },
      {
        label: "Accessories",
        href: "/collections/mens-accessories",
        subItems: [
          { label: "Caps", href: "/collections/mens-caps" },
          { label: "Belts", href: "/collections/mens-belts" },
          { label: "Shawls", href: "/collections/mens-shawls" },
        ],
      },
    ],
  },
  {
    label: "WOMEN",
    href: "/pages/womens-clothing",
    categories: [
      {
        label: "Eastern Wear",
        href: "/collections/womens-eastern",
        subItems: [
          { label: "Stitched Suits", href: "/collections/womens-suits" },
          { label: "Unstitched Fabric", href: "/collections/womens-fabric" },
          { label: "Ready to Wear", href: "/collections/womens-pret" },
        ],
      },
      {
        label: "Separates",
        href: "/collections/womens-separates",
        subItems: [
          { label: "Trousers", href: "/collections/womens-trousers" },
          { label: "Shalwar", href: "/collections/womens-shalwar" },
          { label: "Dupattas", href: "/collections/womens-dupattas" },
        ],
      },
      {
        label: "Winter Wear",
        href: "/collections/womens-winter",
        subItems: [
          { label: "Sweaters", href: "/collections/womens-sweaters" },
          { label: "Shawls", href: "/collections/womens-shawls" },
        ],
      },
    ],
  },
  {
    label: "KIDS",
    href: "/pages/kids-clothing",
    categories: [
      {
        label: "Boys",
        href: "/collections/boys",
        subItems: [
          { label: "Eastern Wear", href: "/collections/boys-eastern" },
          { label: "Western Wear", href: "/collections/boys-western" },
        ],
      },
      {
        label: "Girls",
        href: "/collections/girls",
        subItems: [
          { label: "Eastern Wear", href: "/collections/girls-eastern" },
          { label: "Western Wear", href: "/collections/girls-western" },
        ],
      },
    ],
  },
  {
    label: "FRAGRANCES",
    href: "/collections/fragrances",
    categories: [
      {
        label: "Men",
        href: "/collections/fragrances-men",
      },
      {
        label: "Women",
        href: "/collections/fragrances-women",
      },
    ],
  },
  {
    label: "ABOUT",
    href: "/pages/about",
  },
  {
    label: "CONTACT",
    href: "/contact",
  },
];

// Footer navigation links
export const footerLinks = {
  help: [
    { label: "Exchange & Return", href: "/pages/exchange-return" },
    { label: "Shipping & Handling", href: "/policies/shipping" },
    { label: "Terms & Conditions", href: "/policies/terms" },
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "FAQs", href: "/pages/faq" },
  ],
  about: [
    { label: "Store Locator", href: "/pages/store-locator" },
    { label: "Size Guide", href: "/pages/size-guide" },
    { label: "Career", href: "/pages/career" },
    { label: "Contact Us", href: "/contact" },
  ],
  myAccount: [
    { label: "Login", href: "/account/login" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
    { label: "My Account", href: "/account" },
  ],
};

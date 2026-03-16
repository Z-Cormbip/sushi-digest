import { EggSVG, SalmonSVG, TunaSVG, UniSVG, RoeSVG } from '../assets/svg/sushi';
import { EggIcon, RoeIcon, SalmonIcon, TunaIcon, UniIcon } from '../assets/svg/icon';
import { eggImg, eggRiceImg, roeImg, roeRiceImg,salmonImg, salmonRiceImg, tunaImg, tunaRiceImg, uniImg, uniRiceImg } from '../assets/images';
import type { ComponentType, SVGProps } from "react";

export type Slide = {
  id: string;
  name: string;
  Svg: ComponentType<SVGProps<SVGSVGElement>>;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  alt: string;

  header: {
    title: string,
    features: {
      top: {
        text: string,
        image: string
      }
      base: {
        text: string,
        image: string
      }
    }
  }

  content: {
    paragraph: string,
  }

  specs: string;
};

export const slides: Slide[] = [
  {
    id: "egg",
    name: "Tamago",
    Svg: EggSVG,
    Icon: EggIcon,
    alt: "Tamago Living Capsule",

    header: {
      title: "Tamago Living Capsule",
      features: {
        top: {
          text: "Laminated Protein Envelope",
          image: eggImg,
        },
        base: {
          text: "Engineered Grain Foundation",
          image: eggRiceImg,
        }
      },
    },

    content: {
      paragraph: "A compact social chamber wrapped in thermo-cured yolk paneling. Features integrated seating, soft illumination, and a structural starch base for optimal comfort density."
      },

    specs: "42 sq. cm  |  Open Plan  |  Single Occupancy",
  },

  {
    id: "uni",
    name: "Uni",
    Svg: UniSVG,
    Icon: UniIcon,
    alt: "Uni Tasting Suite",
    
    header: {
      title: "Uni Tasting Suite",
      features: {
        top: {
          text: "Golden Marine Crown",
          image: uniImg,
        },
        base: {
          text: "Engineered Grain Foundation",
          image: uniRiceImg,
        }
      }
    },
    content: {
      paragraph: 
        "A compact dining chamber beneath a sculptural sea-urchin canopy, designed for intimate tastings and quiet gatherings."
    },

    specs: "36 sq. cm | Dining Capsule | Private Seating",
  },

  {
    id: "salmon",
    name: "Salmon",
    Svg: SalmonSVG,
    Icon: SalmonIcon,
    alt: "Atlantic Sleep Module",
    
    header: {
      title: "Atlantic Sleep Module",
      features: {
        top: {
          text: "Marbled Oceanic Cladding",
          image: salmonImg,
        },
        base: {
          text: "Reinforced Grain Substructure",
          image: salmonRiceImg,
        }
      },
    },

    content: {
      paragraph:
        "A private resting chamber defined by coral-toned surface wrap and aerated rice insulation. Designed for thermal balance and uninterrupted repose."
    },

    specs: "38 sq. cm  |  Closed Plan  |  Climate Stable",
  },

  {
    id: "roe",
    name: "Roe",
    Svg: RoeSVG,
    Icon: RoeIcon,
    alt: "Ikura Tea Lounge",
    header: {
      title: "Ikura Tea Lounge",
      features: {
        top: {
          text: "Pearled Marine Canopy",
          image: roeImg,
        },
        base: {
          text: "Aerated Grain Substructure",
          image: roeRiceImg,
        }
      }
    },

    content: {
      paragraph: 
        "A quiet lounge beneath a cluster of translucent roe domes, designed for slow tea rituals and relaxed conversation."
    },

    specs: "34 sq. cm | Social Nook | Tea Ready",
  },

  {
    id: "tuna",
    name: "Tuna",
    Svg: TunaSVG,
    Icon: TunaIcon,
    alt: "Maguro Wet Module",

    header: {
      title: "Maguro Wet Module",
      features: {
        top: {
          text: "High-Density Marine Slab",
          image: tunaImg,
        },
        base: {
          text: "Compacted Grain Pedestal",
          image: tunaRiceImg,
        }
      },
    },

    content: {
      paragraph: 
        "A self-contained sanitation chamber encased in monolithic red protein mass. Engineered for moisture resilience and structural purity."
    },

    specs: "35 sq. cm  |  Utility Optimized  |  Water-Ready",
  },
];

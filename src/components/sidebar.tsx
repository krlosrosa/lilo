"use client"

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Bell,
  HelpCircle,
  Settings,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronSub,
  Package,
  ClipboardList,
  Target,
  Users,
  Truck,
  FileText,
  Database,
  ShoppingCart,
  MapPin,
  Upload,
  Download,
  Car,
  Ship,
  Plane,
  Train,
  Calculator,
  CreditCard,
  Receipt,
  UserCheck,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Tag,
  LogOut,
  User
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ui/theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Can } from "@/permissions/Can";
import { useSidebar } from "@/contexts/SidebarContext";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";


type NavItem = {
  label: string;
  icon: any;
  href?: string;
  permission?: string;
  feature?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/", feature: "Home" },

  {
    label: "Estoque",
    icon: Package,
    feature: "Inventory",
    children: [
      {
        label: "Inventário",
        icon: ClipboardList,
        href: "/inventario",
        feature: "Inventory"
      },
      {
        label: "Cadastros",
        icon: FileText,
        feature: "Inventory",
        children: [
          {
            label: "Produtos",
            icon: ShoppingCart,
            href: "/produtos",
            feature: "Inventory"
          },
          {
            label: "Categorias",
            icon: Tag,
            href: "/categorias",
            feature: "Inventory"
          },
          {
            label: "Localização",
            icon: MapPin,
            href: "/localizacao",
            feature: "Inventory"
          }
        ],
      }
    ]
  },

  {
    label: "Produtividade",
    icon: TrendingUp,
    href: "/produtividade",
    feature: "Productivity"
  },

  {
    label: "Expedição",
    icon: Target,
    feature: "Expedition",
    children: [
      {
        label: "Mapa de separação",
        icon: Upload,
        href: "/upload",
        feature: "Expedition"
      },
      {
        label: "Demanda Pallet",
        icon: Package,
        href: "/ressuprimento",
        feature: "Inativo"
      },
      {
        label: "Controle de Qualidade",
        icon: CheckCircle,
        href: "/qualidade",
        feature: "Inativo"
      }
    ],
  },

  {
    label: "Recebimento",
    icon: Download,
    feature: "Receive",
    children: [
      {
        label: "Notas Fiscais",
        icon: Receipt,
        href: "/nf",
        feature: "Receive"
      },
      {
        label: "Conferência",
        icon: CheckCircle,
        href: "/conferencia",
        feature: "Receive"
      },
      {
        label: "Devoluções",
        icon: AlertTriangle,
        href: "/devolucoes",
        feature: "Receive"
      }
    ]
  },

  {
    label: "Transporte",
    icon: Truck,
    feature: "Transport",
    children: [
      {
        label: "Terrestre",
        icon: Car,
        href: "/transporte/terrestre",
        feature: "Transport",
        children: [
          {
            label: "Caminhões",
            icon: Truck,
            href: "/transporte/caminhoes",
            feature: "Transport"
          },
          {
            label: "Vans",
            icon: Car,
            href: "/transporte/vans",
            feature: "Transport"
          }
        ]
      },
      {
        label: "Marítimo",
        icon: Ship,
        href: "/transporte/maritimo",
        feature: "Transport"
      },
      {
        label: "Aéreo",
        icon: Plane,
        href: "/transporte/aereo",
        feature: "Transport"
      },
      {
        label: "Ferroviário",
        icon: Train,
        href: "/transporte/ferroviario",
        feature: "Transport"
      }
    ]
  },

  {
    label: "Administrativo",
    icon: FileText,
    feature: "Administrative",
    children: [
      {
        label: "Financeiro",
        icon: Calculator,
        href: "/financeiro",
        feature: "Administrative",
        children: [
          {
            label: "Contas a Pagar",
            icon: CreditCard,
            href: "/financeiro/pagar",
            feature: "Administrative"
          },
          {
            label: "Contas a Receber",
            icon: Receipt,
            href: "/financeiro/receber",
            feature: "Administrative"
          }
        ]
      },
      {
        label: "Recursos Humanos",
        icon: Users,
        href: "/rh",
        feature: "Administrative",
        children: [
          {
            label: "Funcionários",
            icon: UserCheck,
            href: "/rh/funcionarios",
            feature: "Administrative"
          },
          {
            label: "Ponto Eletrônico",
            icon: Clock,
            href: "/rh/ponto",
            feature: "Administrative"
          }
        ]
      },
      {
        label: "Relatórios",
        icon: PieChart,
        href: "/relatorios",
        feature: "Administrative",
        children: [
          {
            label: "Vendas",
            icon: TrendingUp,
            href: "/relatorios/vendas",
            feature: "Administrative"
          },
          {
            label: "Estoque",
            icon: Database,
            href: "/relatorios/estoque",
            feature: "Administrative"
          },
          {
            label: "Produtividade",
            icon: Star,
            href: "/relatorios/produtividade",
            feature: "Administrative"
          }
        ]
      }
    ]
  },
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<{ [label: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") handleToggleCollapse();
  };

  const handleToggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      e.currentTarget.blur();
    }
  };

  // Função para verificar se um item ou seus filhos correspondem ao filtro
  const itemMatchesSearch = (item: NavItem): boolean => {
    const matchesLabel = item.label.toLowerCase().includes(searchTerm.toLowerCase());

    if (matchesLabel) return true;

    if (item.children) {
      return item.children.some(child => itemMatchesSearch(child));
    }

    return false;
  };

  // Função para filtrar itens de navegação
  const getFilteredItems = (items: NavItem[]): NavItem[] => {
    if (!searchTerm) return items;

    return items.filter(item => itemMatchesSearch(item));
  };

  // Função para abrir automaticamente submenus que contêm resultados da busca
  const shouldAutoOpenSubmenu = (item: NavItem): boolean => {
    if (!searchTerm) return false;

    if (itemMatchesSearch(item)) {
      if (item.children) {
        return item.children.some(child => itemMatchesSearch(child));
      }
    }

    return false;
  };

  // Abrir automaticamente submenus que contêm resultados da busca
  useEffect(() => {
    if (searchTerm) {
      const newOpenSubmenus: { [label: string]: boolean } = {};

      navItems.forEach(item => {
        if (shouldAutoOpenSubmenu(item)) {
          newOpenSubmenus[item.label] = true;
        }
      });

      setOpenSubmenus(newOpenSubmenus);
    } else {
      setOpenSubmenus({});
    }
  }, [searchTerm]);

  const filteredNavItems = getFilteredItems(navItems);

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex flex-col justify-between h-screen bg-background border-r border-border p-2 gap-2 fixed top-0 left-0 z-30 transition-all duration-300",
          isCollapsed ? "w-14 min-w-[3.5rem]" : "w-60 min-w-[15rem]"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Top Section */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className={cn("flex items-center gap-2 px-1", isCollapsed && "justify-center px-0")}>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
              {/* Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="currentColor" />
                <circle cx="12" cy="14" r="6" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </span>
            {!isCollapsed && (
              <span className="text-base font-bold text-foreground select-none transition-opacity duration-300">Lilo</span>
            )}
            {/* Collapse Button (md+) */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-auto hidden md:inline-flex", isCollapsed && "mx-0")}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              tabIndex={0}
              onClick={handleToggleCollapse}
              onKeyDown={handleKeyDown}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          {/* Search */}
          {!isCollapsed && (
            <div className="relative transition-all duration-300">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
              </span>
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="pl-8 h-8 text-sm bg-muted text-foreground placeholder:text-muted-foreground focus:bg-background"
                aria-label="Buscar no menu"
                tabIndex={0}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                  aria-label="Limpar busca"
                  tabIndex={0}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              )}
            </div>
          )}
          {/* Navigation */}
          <nav className="flex flex-col gap-1 mt-1" aria-label="Main navigation">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item, index) => {
                const renderNavItem = (navItem: NavItem, level: number = 0) => {
                  const { label, icon: Icon, children, href, feature } = navItem;
                  const hasChildren = !!children && children.length > 0;
                  const isOpen = !!openSubmenus[label];
                  const indentClass = level > 0 ? `ml-${level * 2}` : "";

                  // Se não tem children e tem href, renderiza como link
                  if (!hasChildren && href) {
                    const linkContent = (
                      <div
                        className={cn(
                          "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
                          isCollapsed && "justify-center px-0",
                          indentClass
                        )}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {!isCollapsed && (
                          <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
                        )}
                      </div>
                    );
                    return (
                      <Can key={`${index}-${level}`} I="read" a={feature || "default"}>
                        <div>
                          {isCollapsed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={href} tabIndex={0} aria-label={label}>
                                  {linkContent}
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="select-none">
                                {label}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <a
                              href={href}
                              tabIndex={0}
                              aria-label={label}
                              className="block"
                            >
                              {linkContent}
                            </a>
                          )}
                        </div>
                      </Can>
                    );
                  }

                  // Caso tenha children, mantém Dropdown/Tooltip
                  const menuButton = (
                    <div
                      className={cn(
                        "flex items-center group gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9 cursor-pointer select-none",
                        isCollapsed && "justify-center px-0",
                        indentClass
                      )}
                      tabIndex={0}
                      aria-label={label}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      aria-expanded={hasChildren ? isOpen : undefined}
                      onClick={hasChildren && !isCollapsed ? () => handleToggleSubmenu(label) : undefined}
                      onKeyDown={hasChildren && !isCollapsed ? (e) => {
                        if (e.key === "Enter" || e.key === " ") handleToggleSubmenu(label);
                      } : undefined}
                      role="button"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {!isCollapsed && (
                        <span className="font-medium transition-opacity duration-300 flex-1">{label}</span>
                      )}
                      {hasChildren && !isCollapsed && (
                        isOpen ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronSub className="w-4 h-4 ml-auto" />
                      )}
                    </div>
                  );

                  return (
                    <Can key={`${index}-${level}`} I="read" a={feature || "default"}>
                      <div key={label} className="w-full">
                        {isCollapsed ? (
                          hasChildren ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {menuButton}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="right" align="start" className="min-w-[14rem] max-w-[18rem]">
                                {children?.map((sub) => {
                                  const subHasChildren = !!sub.children && sub.children.length > 0;

                                  if (subHasChildren) {
                                    return (
                                      <DropdownMenuItem key={sub.label} className="p-0">
                                        <div className="w-full">
                                          <div className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-medium border-b border-border/50">
                                            <div className="flex items-center gap-2">
                                              {sub.icon && <sub.icon className="w-4 h-4" />}
                                              <span>{sub.label}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4" />
                                          </div>
                                          <div className="py-0.5">
                                            {sub.children?.map((subSub) => {
                                              const subSubHasChildren = !!subSub.children && subSub.children.length > 0;

                                              if (subSubHasChildren) {
                                                return (
                                                  <div key={subSub.label} className="px-3 py-0.5">
                                                    <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                                                      <div className="flex items-center gap-2">
                                                        {subSub.icon && <subSub.icon className="w-3 h-3" />}
                                                        <span>{subSub.label}</span>
                                                      </div>
                                                      <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                    <div className="ml-2 border-l border-border/30 pl-2">
                                                      {subSub.children?.map((subSubSub) => (
                                                        <DropdownMenuItem asChild key={subSubSub.label}>
                                                          <Can I="read" a={subSubSub.feature || "default"}>
                                                            <a
                                                              href={subSubSub.href}
                                                              className="flex items-center gap-2 px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground text-xs transition-colors outline-none rounded"
                                                              tabIndex={0}
                                                              aria-label={subSubSub.label}
                                                            >
                                                              {subSubSub.icon && <subSubSub.icon className="w-3 h-3" />}
                                                              <span>{subSubSub.label}</span>
                                                            </a>
                                                          </Can>
                                                        </DropdownMenuItem>
                                                      ))}
                                                    </div>
                                                  </div>
                                                );
                                              }

                                              return (
                                                <DropdownMenuItem asChild key={subSub.label}>
                                                  <Can I="read" a={subSub.feature || "default"}>
                                                    <a
                                                      href={subSub.href}
                                                      className="flex items-center gap-2 px-3 py-1 text-muted-foreground hover:bg-muted hover:text-foreground text-xs transition-colors outline-none"
                                                      tabIndex={0}
                                                      aria-label={subSub.label}
                                                    >
                                                      {subSub.icon && <subSub.icon className="w-3 h-3" />}
                                                      <span>{subSub.label}</span>
                                                    </a>
                                                  </Can>
                                                </DropdownMenuItem>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  }

                                  return (
                                    <DropdownMenuItem asChild key={sub.label}>
                                      <Can I="read" a={sub.feature || "default"}>
                                        <a
                                          href={sub.href}
                                          className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground text-sm transition-colors outline-none"
                                          tabIndex={0}
                                          aria-label={sub.label}
                                        >
                                          {sub.icon && <sub.icon className="w-4 h-4" />}
                                          <span>{sub.label}</span>
                                        </a>
                                      </Can>
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : null
                        ) : (
                          menuButton
                        )}
                        {/* Submenu recursivo */}
                        {hasChildren && isOpen && !isCollapsed && (
                          <div className="ml-4 mt-1 flex flex-col gap-1">
                            {children?.map((sub) => (
                              <div key={sub.label}>
                                {renderNavItem(sub, level + 1)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Can>
                  );
                };

                return renderNavItem(item);
              })
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado para "{searchTerm}"
              </div>
            )}
          </nav>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          <Can I="read" a="Inativo">
            <div className="flex flex-col gap-1">
              <a
                href="#"
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                  isCollapsed && "justify-center px-0"
                )}
                tabIndex={0}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {!isCollapsed && <span className="font-medium flex-1">Notifications</span>}
                {!isCollapsed && <Badge className="bg-violet-400 text-white ml-1 text-xs px-1.5 py-0.5">12</Badge>}
              </a>
              <a
                href="#"
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                  isCollapsed && "justify-center px-0"
                )}
                tabIndex={0}
                aria-label="Support"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                {!isCollapsed && <span className="font-medium">Support</span>}
              </a>
              <a
                href="#"
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground transition-colors outline-none text-sm h-9",
                  isCollapsed && "justify-center px-0"
                )}
                tabIndex={0}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                {!isCollapsed && <span className="font-medium">Settings</span>}
              </a>
            </div>
          </Can>
          {/* User Card */}
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-xl bg-muted transition-all duration-300",
            isCollapsed && "justify-center p-1"
          )}>
            <Avatar className="w-7 h-7">
              <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium text-foreground truncate text-sm">{session?.user?.name || 'Usuário'}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {session?.user?.center || 'Sem centro'}
                </span>
              </div>
            )}
            {!isCollapsed && <span className="w-2 h-2 rounded-full bg-green-500 mr-1" aria-label="Online" />}
            
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    aria-label="User menu"
                    tabIndex={0}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <ThemeToggle isCollapsed={false} />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

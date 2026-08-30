import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  iconClass: string; // font-size + margin riêng cho từng icon
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  logoUrl = 'assets/images/logo.webp';

  navItems: NavItem[] = [
    {
      path: '/admin/overview',
      label: 'Overview',
      icon: 'mdi-light--view-dashboard',
      iconClass: 'text-[25px] ml-[3px]',
    },
    {
      path: '/admin/customers',
      label: 'Customers',
      icon: 'ph--users-light',
      iconClass: 'text-[23px] ml-[3px]',
    },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: 'solar--bag-3-linear',
      iconClass: 'text-[27px]',
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: 'fluent--box-20-regular',
      iconClass: 'text-[27px]',
    },
    {
      path: '/admin/messages',
      label: 'Messages',
      icon: 'ant-design--message-outlined',
      iconClass: 'text-[24px] ml-[2px]',
    },
    {
      path: '/admin/systems',
      label: 'Systems',
      icon: 'fluent-mdl2--file-system',
      iconClass: 'text-[20px] ml-[3px] mt-[2px]',
    },
    {
      path: '/admin/shipments',
      label: 'Shipments',
      icon: 'la--shipping-fast',
      iconClass: 'text-[23px] ml-[3px]',
    },
    {
      path: '/admin/pages',
      label: 'Pages',
      icon: 'iconoir--multiple-pages-empty',
      iconClass: 'text-[23px] ml-[2px]',
    },
  ];

  handleLogout(): void {
    // TODO: thêm logic logout thật (clear storage, redirect...)
    console.log('User logged out');
  }
}

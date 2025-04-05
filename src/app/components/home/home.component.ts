import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  activeTab: string = 'men';

  menProducts = [
    {
      image: 'assets/men-product1.jpg',
      name: "Men's Casual Shirt",
      description: 'Cotton, Slim Fit',
      price: 799,
      originalPrice: 1299,
      rating:5,
      reviews : 5
    },
    {
      image: 'assets/men-product2.jpg',
      name: "Men's Running Shoes",
      description: 'Breathable, Lightweight',
      price: 1299,
      originalPrice: 2499,
      rating:5,
      reviews : 5
    }
  ];

  womenProducts = [
    {
      image: 'assets/women-product1.jpg',
      name: "Women's Handbag",
      description: 'Leather, Elegant Design',
      price: 999,
      originalPrice: 1999,
      rating:5,
      reviews : 5
    },
    {
      image: 'assets/women-product2.jpg',
      name: "Women's Kurti",
      description: 'Cotton, Stylish Print',
      price: 699,
      originalPrice: 1499,
      rating:5,
      reviews : 5
    }
  ];

  kidsProducts = [
    {
      image: 'assets/kids-product1.jpg',
      name: "Kids' Sneakers",
      description: 'Comfortable, Stylish',
      price: 599,
      originalPrice: 999,
      rating:5,
      reviews : 5

    },
    {
      image: 'assets/kids-product2.jpg',
      name: "Kids' Cartoon T-Shirt",
      description: 'Soft Cotton Fabric',
      price: 399,
      originalPrice: 799,
      rating:5,
      reviews : 5

    }
  ];
}

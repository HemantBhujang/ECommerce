import { Component } from '@angular/core';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
constructor(private orderService :OrderService){}
ngOnInit(){
  this.getMyorder();
}
getMyorder(){
  this.orderService.getUserOrder().subscribe({
    next:(response)=>{
      console.log(response);
    }
    ,error:(error)=>{ 
      console.error('Error fetching orders:', error);
    }
})
}
}

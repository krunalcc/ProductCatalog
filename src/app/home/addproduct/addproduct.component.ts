import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_services/product.service';
import { Product } from 'src/app/_models/products';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Loading } from '../../_helpers/loader/Loading';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  product = new Product();
  constructor(private productService: ProductService, public _router: Router, public dialog: MatDialog, private ToastrService: ToastrService) {
  }

  ngOnInit(): void {
  }
  addProduct() {
    Loading.show();
    this.productService.add(this.product).subscribe(d => {
      this.dialog.closeAll();
      Loading.hide();
    },
      error => {
        this.ToastrService.info(error);
        Loading.hide();
      })
  }
}

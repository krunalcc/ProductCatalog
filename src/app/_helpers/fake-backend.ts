import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import * as data from '../jsonFiles/product.json';
import { Product } from '../_models/products';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users') as string) || [];
let Products: Product[] = <Product[]>JSON.parse(localStorage.getItem('products') as string) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/products') && method === 'GET':
                    return getProducts();
                case url.endsWith('/products/add') && method === 'POST':
                    return addProduct();
                case url.match(/\/products\/\d+$/) && method === 'DELETE':
                    return deleteProduct();
                case !url.match(/\/products\/\d+$/) && method === 'GET':
                    return getProduct();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find((x: any) => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find((x: any) => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getProducts() {
            if (!isLoggedIn()) return unauthorized();
            if (Products == null || (Products != null && Products.length == 0)) {
                let productData: any = data;
                localStorage.setItem('products', JSON.stringify(productData.default));
            }
            Products = <Product[]>(JSON.parse(localStorage.getItem('products') as string));
            return ok(Products);
        }

        function addProduct() {
            if (!isLoggedIn()) return unauthorized();
            const product: Product = <Product>body;

            if (Products.find(x => x.productSKU === product.productSKU)) {
                return error("Product SKU is already exists...!")
            }

            product.productId = Products.length ? Math.max(...Products.map(x => x.productId)) + 1 : 1;
            Products.push(product);
            localStorage.setItem('products', JSON.stringify(Products));

            return ok();
        }

        function deleteProduct() {
            if (!isLoggedIn()) return unauthorized();
            Products = Products.filter(x => x.productId !== idFromUrl());
            localStorage.setItem('products', JSON.stringify(Products));
            return ok();
        }

        function getProduct() {
            if (!isLoggedIn()) return unauthorized();
            let startValue: string = ValFromUrl();
            let FilteredProducts = Products.filter(x => (startValue.length > 0 ? x.productName.toLowerCase().startsWith(startValue) : true));
            return ok(FilteredProducts);
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter((x: any) => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: string) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function ValFromUrl() {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1].toString().toLowerCase();
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
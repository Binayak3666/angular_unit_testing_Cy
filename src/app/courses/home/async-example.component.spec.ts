import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async testing example",()=>{
    it("Asyncronous example with testing done()",(done:DoneFn)=>{
        let test = false;
        
        setTimeout(()=>{
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done()
        },1000)
    })
    it("Asyncronous example with testing setTimeOut()",fakeAsync(()=>{
        let test = false;
        setTimeout(()=>{})
        setTimeout(()=>{
            console.log('running assertions ----->setTimeOut()');
            test = true;
            expect(test).toBeTruthy();
        },1000)
        flush()
        expect(test).toBeTruthy();
    }))
    it("Asyncronous example with testing promises",fakeAsync(()=>{
        let test = false;
        //here the test rturn will be promise based code 
        console.log("creating promise")
        Promise.resolve().then(()=>{
            console.log('promise evaluated successfully');
            test = true
            return Promise.resolve()
        }).then(()=>{
            console.log('Inner promise evaluated successfully');            
        })
        flushMicrotasks();
        console.log('running test assertion')
        expect(test).toBeTruthy();
    }))

    it("Asyncronous example with promises + setTimeOut",fakeAsync(()=>{
        let counter = 0;
        Promise.resolve().then(()=>{
            counter+=10
            setTimeout(()=>{
                counter += 1;
            },1000)
        })        
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(500)
        expect(counter).toBe(10);
        tick(500)
        expect(counter).toBe(11);
    }))
    it("Asyncronous example with Observable",fakeAsync(()=>{
        let test= false;
        console.log("creating observable")
        const test$ = of(test).pipe(delay(1000))
        test$.subscribe(()=>{
            test = true;
        })
        tick(1000)
        console.log("running test assertions");
        expect(test).toBe(true)
    }))


})

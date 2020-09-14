import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from '../helpers/authentication.service';
import { DashboardComponent } from './dashboard.component';

class AuthenticationServiceStub {
  login = () => 1;
  logout = () => { };
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let authenticationService: AuthenticationService;
  const authenticationServiceStub = new AuthenticationServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthenticationService, useValue: authenticationServiceStub }]
    })
      .compileComponents();
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.availableBalance = 1000;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expect isRechargeDone is false when closeAlert is called', () => {
    component.closeAlert();
    expect(component.isRechargeDone).toBeFalsy();
  });

  it('should expect isRechargeDone is false when doRecharge is called', () => {
    component.rechargeAmount = 500;
    component.doRecharge();
    expect(component.availableBalance).toEqual(1500);
    expect(component.isRechargeDone).toBeTruthy();
  });

  it('should expect true when pack is subscribed', () => {
    component.currentPack = [{
      name: 'Zee',
      cost: 10
    }, {
      name: 'LearnEnglish',
      cost: 200
    }];
    expect(component.checkSubscription('Zee')).toEqual(true);
    expect(component.checkSubscription('LearnEnglish')).toEqual(true);
    expect(component.checkSubscription('aaa')).toEqual(false);
    expect(component.checkSubscription('')).toEqual(false);
    expect(component.checkSubscription(null)).toEqual(false);
  });

  it('should expect false when pack is not subscribed', () => {
    component.currentPack = [{
      name: 'Zee',
      cost: 10
    }, {
      name: 'LearnEnglish',
      cost: 200
    }];
    expect(component.checkSubscription('aaa')).toEqual(false);
    expect(component.checkSubscription('')).toEqual(false);
    expect(component.checkSubscription(null)).toEqual(false);
  });

  describe('channelSubscription function', () => {
    it('should expect isChannelsSubscSucess true when new subscription channels is added', () => {
      const mockSubscriptionSuccessObj = {
        subscribedMonths: 2,
        subscribedPack: 'Gold Pack',
        subscribedPackCost: 100,
        subscriptionCost: 200,
        discount: 20,
        finalPrice: 180
      };
      component.subscriptionFormObj = {
        rechargePackKey: 'G',
        rechargePackMonth: 2
      };
      component.channelSubscription();
      expect(component.subscriptionSuccessObj).toEqual(mockSubscriptionSuccessObj);
      expect(component.availableBalance).toEqual(820);
      expect(component.errorMessage).toBeNull();
    });

    it('should expect errorMessage when subscribed channel already exists', () => {
      component.subscriptionFormObj = {
        rechargePackKey: 'G',
        rechargePackMonth: 2
      };
      component.currentPack = [{
        name: 'Gold Pack',
        cost: 10
      }];
      component.channelSubscription();
      expect(component.availableBalance).toEqual(820);
    });

    it('should expect errorMessage when balance is less than channel cost', () => {
      component.availableBalance = 5;
      component.subscriptionFormObj = {
        rechargePackKey: 'G',
        rechargePackMonth: 2
      };
      component.channelSubscription();
      expect(component.errorMessage).toEqual(`Entered value exceeds your account Balance. Please recharge your balance to proceed`);
    });

    it('should expect errorMessage when invalid channel is entered', () => {
      component.subscriptionFormObj = {
        rechargePackKey: 'aaa',
        rechargePackMonth: 2
      };
      component.channelSubscription();
      expect(component.errorMessage).toEqual('Enter a valid Recharge Key');
    });

  });

  describe('addChannels function', () => {
    beforeEach(() => {
      component.rechargeChannelValue = 'Zee';
    });

    it('should expect isChannelsSubscSucess true when new subscription channels is added', () => {
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addChannels();
      expect(component.channelSubscCost).toEqual(10);
      expect(component.availableBalance).toEqual(990);
      expect(component.errorMessage).toBeNull();
      expect(component.isChannelsSubscSucess).toBeTruthy();
    });

    it('should expect errorMessage when subscribed channel already exists', () => {
      spyOn(component, 'checkSubscription').and.returnValue(true);
      component.addChannels();
      expect(component.isChannelSubscSubmitted).toBeTruthy();
      expect(component.errorMessage).toEqual('Already Subscribed');
    });

    it('should expect errorMessage when balance is less than channel cost', () => {
      component.availableBalance = 5;
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addChannels();
      expect(component.isChannelSubscSubmitted).toBeTruthy();
      expect(component.isServiceSubscSucess).toBeFalsy();
      expect(component.errorMessage).toEqual(`Entered channels cannot be subscribed as exceeds your account Balance.
      Please recharge your balance to subscribe`);
    });

    it('should expect errorMessage when invalid channel is entered', () => {
      component.rechargeChannelValue = 'aaaa';
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addChannels();
      expect(component.isChannelSubscSubmitted).toBeTruthy();
      expect(component.isServiceSubscSucess).toBeFalsy();
      expect(component.errorMessage).toEqual('Please Enter Valid Channel Name');
    });

    it('should expect isChannelsSubscSucess true when new subscription service is added', () => {
      component.rechargeChannelValue = 'Zee,Sony';
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addChannels();
      expect(component.channelSubscCost).toEqual(25);
      expect(component.availableBalance).toEqual(975);
      expect(component.errorMessage).toBeNull();
      expect(component.isChannelsSubscSucess).toBeTruthy();
    });

  });

  describe('addServices function', () => {
    beforeEach(() => {
      component.rechargeService = 'LearnEnglish';
    });

    it('should expect isServiceSubscSucess true when new subscription service is added', () => {
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addServices();
      expect(component.isServiceSubscSubmitted).toBeTruthy();
      expect(component.isServiceSubscSucess).toBeTruthy();
      expect(component.availableBalance).toEqual(800);
      expect(component.errorMessage).toEqual(null);
    });

    it('should expect errorMessage when subscribed service already exists', () => {
      spyOn(component, 'checkSubscription').and.returnValue(true);
      component.addServices();
      expect(component.isServiceSubscSubmitted).toBeTruthy();
      expect(component.errorMessage).toEqual('Already Subscribed');
    });

    it('should expect errorMessage when balance is less than service cost', () => {
      component.availableBalance = 100;
      spyOn(component, 'checkSubscription').and.returnValue(false);
      component.addServices();
      expect(component.isServiceSubscSubmitted).toBeTruthy();
      expect(component.isServiceSubscSucess).toBeFalsy();
      expect(component.errorMessage).not.toEqual(null);
    });

  });

  it('should expect updateMessage to true when updateUser is called', () => {
    component.updateUser();
    expect(component.updateMessage).toBeTruthy();
  });

  it('should expect authenticationService logout is called when calling logout', () => {
    spyOn(authenticationService, 'logout');
    component.logout();
    expect(authenticationService.logout).toHaveBeenCalled();
  });

});

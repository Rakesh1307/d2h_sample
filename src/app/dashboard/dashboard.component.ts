import { Component } from '@angular/core';

import { AuthenticationService } from '../helpers/authentication.service';

interface SubscriptionFormObj {
  rechargePackKey: string;
  rechargePackMonth: number;
}

interface SubscriptionSuccessObj {
  subscribedPack: string;
  subscribedPackCost: number;
  subscriptionCost: number;
  discount: number;
  finalPrice: number;
  subscribedMonths: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  availableBalance = 100;
  isRechargeDone: boolean;
  rechargeAmount: number;
  currentPack = [];
  packs = [{
    name: 'Silver Pack',
    cost: 50,
    key: 'S'
  }, {
    name: 'Gold Pack',
    cost: 100,
    key: 'G'
  }];
  channels = [{
    name: 'Zee',
    cost: 10
  }, {
    name: 'Sony',
    cost: 15
  }, {
    name: 'Star Plus',
    cost: 20
  }, {
    name: 'Discovery',
    cost: 10
  }, {
    name: 'NatGeo',
    cost: 20
  }];
  services = [
    {
      name: 'LearnEnglish',
      cost: 200
    }, {
      name: 'LearnCooking',
      cost: 100
    },
  ];
  subscriptionFormObj = {} as SubscriptionFormObj;
  isSubscriptionSuccess: boolean;
  subscriptionSuccessObj = {} as SubscriptionSuccessObj;
  isSubmitted: boolean;
  rechargeChannelValue: string;
  errorMessage: string;
  isChannelsSubscSucess: boolean;
  channelSubscCost = 0;
  isChannelSubscSubmitted: boolean;
  rechargeService: string;
  isServiceSubscSubmitted: boolean;
  serviceSubscCost: number;
  isServiceSubscSucess: boolean;
  updateMessage: boolean;
  emailId = 'abc@example.com';
  phoneNumber = 9999999999;

  constructor(
    private authenticationService: AuthenticationService) { }

  closeAlert(): void {
    this.isRechargeDone = false;
  }

  /**
   * @description used to do new recharge
   */
  doRecharge(): void {
    this.availableBalance = this.availableBalance + this.rechargeAmount;
    this.isRechargeDone = true;
    this.rechargeAmount = null;
  }

  /**
   * @description to subscribe new channel
   */
  channelSubscription(): void {
    this.isSubmitted = true;
    const matchedPack = this.packs.filter(
      pack => {
        return pack.key === this.subscriptionFormObj.rechargePackKey.toUpperCase();
      })[0];
    if (matchedPack) {
      if (this.currentPack.includes(matchedPack)) {
        this.errorMessage = 'Already Subscribed';
      } else {
        const subscribedAmount = matchedPack.cost * this.subscriptionFormObj.rechargePackMonth;
        const discountedPrice = (subscribedAmount) * 10 / 100;
        const finalAmount = subscribedAmount - discountedPrice;
        if (finalAmount < this.availableBalance) {
          this.errorMessage = null;
          this.currentPack.push(matchedPack);
          this.subscriptionSuccessObj = {
            subscribedMonths: this.subscriptionFormObj.rechargePackMonth,
            subscribedPack: matchedPack.name,
            subscribedPackCost: matchedPack.cost,
            subscriptionCost: subscribedAmount,
            discount: discountedPrice,
            finalPrice: finalAmount
          };
          this.availableBalance = this.availableBalance - finalAmount;
        } else {
          this.errorMessage = `Entered value exceeds your account Balance. Please recharge your balance to proceed`;
        }
      }
    } else {
      this.errorMessage = 'Enter a valid Recharge Key';
    }
  }

  /**
   * @description to check whether it is new subscription or already subscribed
   * @param {string} name check with subscribed packs whether already subscribed or not
   * @returns {boolean} true if already present, else false
   */
  checkSubscription(name: string): boolean {
    const check = this.currentPack.filter(current => {
      if (current.name === name) {
        return true;
      }
      return false;
    });
    return check && check.length ? true : false;
  }

  /**
   * @description to add new channels to your account
   */
  addChannels(): void {
    this.errorMessage = null;
    this.isChannelSubscSubmitted = true;
    this.channelSubscCost = 0;
    const rechargeChannels = this.rechargeChannelValue.toLowerCase().split(',');
    this.channels.filter(channel => {
      if (rechargeChannels.includes(channel.name.toLowerCase())) {
        if (this.checkSubscription(channel.name)) {
          this.errorMessage = 'Already Subscribed';
        } else {
          this.currentPack.push(channel);
          this.channelSubscCost += channel.cost;
        }
      }
    });
    if (!this.errorMessage) {
      if (this.channelSubscCost > this.availableBalance) {
        this.errorMessage = `Entered channels cannot be subscribed as exceeds your account Balance.
      Please recharge your balance to subscribe`;
      } else if (this.channelSubscCost === 0) {
        this.errorMessage = 'Please Enter Valid Channel Name';
      } else {
        this.errorMessage = null;
        this.availableBalance -= this.channelSubscCost;
        this.isChannelsSubscSucess = true;
      }
    }
  }

  /**
   * @description to add new services to your account
   */
  addServices(): void {
    this.isServiceSubscSubmitted = true;
    this.errorMessage = null;
    this.isServiceSubscSucess = false;
    this.services.filter(service => {
      if (this.rechargeService.toLowerCase().includes(service.name.toLowerCase())) {
        if (this.checkSubscription(service.name)) {
          this.errorMessage = 'Already Subscribed';
        } else if (this.availableBalance - service.cost >= 0) {
          this.errorMessage = null;
          this.availableBalance -= service.cost;
          this.isServiceSubscSucess = true;
          this.currentPack.push(service);
        } else if (this.availableBalance - service.cost < 0) {
          this.isServiceSubscSucess = false;
          this.errorMessage = `Entered services cannot be subscribed as exceeds your account Balance.
          Please recharge your balance to subscribe`;
        } else {
          this.errorMessage = 'Please Enter Valid Service Name';
        }
      }
    });
  }

  /**
   * @description to update the mailid and phone number
   */
  updateUser(): void {
    this.updateMessage = true;
  }

  /**
   * @description loggs you out of the application
   */
  logout(): void {
    this.authenticationService.logout();
  }
}

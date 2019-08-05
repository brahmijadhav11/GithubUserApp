import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IUserListDTO } from 'src/app/interfaces/user-list-dto';
import { IUserRepoDetailDTO } from 'src/app/interfaces/user-repo-detail-dto';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as _ from "lodash";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  filteredUserList: IUserListDTO[] = [];
  isShowUserDetails = false;
  searchText: string;
  sortvalue = "";
  totalCount: number;
  totalResult: number;
  userList: IUserListDTO[] = [];

  constructor(private userService: UserService, private ngxService: NgxUiLoaderService) {
  }

  ngOnInit() {
  }

  getUserList(searchString: string) {
    this.userService.getUserListByName(searchString).subscribe((data) => {
      let respData: any = data;
      if (respData && respData.items && respData.items.length) {
        this.ngxService.stop();
        this.totalResult = respData.total_count;
        this.userList = respData.items;
        this.setInitialValue();
        this.totalCount = this.userList.length;
        this.filteredUserList = this.userList.slice(0, 10);
      }
    });
  }

  setInitialValue() {
    this.userList.forEach(element => {
      element.btnValue = "Details";
      element.isShowUserRepoDetail = false;
    });
  }

  onUserDetailsClick = (selectedUserId: number) => {
    this.filteredUserList.forEach(element => {
      if (element.id === selectedUserId) {
        element.isShowUserRepoDetail = !element.isShowUserRepoDetail;
        if (element.isShowUserRepoDetail) {
          element.btnValue = "Collapse";
          this.ngxService.start();
          this.getUserDetails(selectedUserId, element.login);
        } else {
          element.btnValue = "Details";
          element.isShowUserRepoDetail = false;
        }
      }
    });
  }

  getUserDetails(selectedUserId: number, userName: string) {
    this.userService.getUserDetailByName(userName).subscribe((data) => {
      const respData: any = data;
      if (respData && respData.length) {
        this.setUserDetails(selectedUserId, respData);
        this.ngxService.stop();
      }
    });
  }

  setUserDetails(selectedUserId: number, repositoryList: IUserRepoDetailDTO[]) {
    this.filteredUserList.forEach(element => {
      if (element.id === selectedUserId) {
        element.repositoryList = repositoryList;
      }
    });
  }

  onSearchStringChange(event) {
    this.ngxService.start();
    this.getUserList(this.searchText);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.filteredUserList = this.userList.slice(startItem, endItem);
  }

  changeSortOption(event) {
    if (this.filteredUserList.length && this.sortvalue && this.sortvalue !== '') {
      if (this.sortvalue === 'nameAsc') {
        this.filteredUserList = _.orderBy(this.userList, 'login', 'asc');
      } else if (this.sortvalue === 'nameDesc') {
        this.filteredUserList = _.orderBy(this.userList, 'login', 'desc');
      } else if (this.sortvalue === 'rankAsc') {
        this.filteredUserList = _.orderBy(this.userList, 'score', 'asc');
      } else if (this.sortvalue === 'rankDesc') {
        this.filteredUserList = _.orderBy(this.userList, 'score', 'desc');
      }
    }
  }
}

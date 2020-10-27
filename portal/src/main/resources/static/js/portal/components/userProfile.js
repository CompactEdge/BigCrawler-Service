export default `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid" style="height: 80px">
      <div class="col-2"></div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="sr-only">Toggle navigation</span>
        <span class="navbar-toggler-icon icon-bar"></span>
        <span class="navbar-toggler-icon icon-bar"></span>
        <span class="navbar-toggler-icon icon-bar"></span>
      </button>
    </div>
  </nav>
  <!-- End Navbar -->

  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">perm_identity</i>
              </div>
              <h4 class="card-title">Profile</h4>
              <small class="category">수정하신 내용을 저장하시려면 하단의 'UPDATE' 버튼을 눌러주세요.</small>
            </div>
            <div class="card-body">
              <form action="" id="postUserProfile">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">User ID</label>
                      <input
                        type="text"
                        class="form-control"
                        name="userId"
                        readonly
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">Username</label>
                      <input
                        type="text"
                        class="form-control"
                        name="username"
                        readonly
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">Group</label>
                      <input
                        type="text"
                        class="form-control"
                        name="userGroup"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">Status</label>
                      <input
                        type="text"
                        class="form-control"
                        name="status"
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        name="email"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="bmd-label-floating">Phone</label>
                      <input
                        type="text"
                        class="form-control"
                        name="phone"
                      >
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning pull-right">UPDATE</button>
                <div class="clearfix"></div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card card-profile">
            <div class="card-avatar">
              <div class="picture-container">
                <div class="picture">
                  <img src="/img/default-avatar.png" class="picture-src" id="wizardPicturePreview" title="">
                  <!-- <input type="file" id="wizard-picture"> -->
                </div>
              </div>
            </div>
            <div class="card-body">
              <h6 class="card-category text-gray"></h6>
              <h4 class="card-title text-user-name"></h4>
              <p class="card-description text-user-group"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
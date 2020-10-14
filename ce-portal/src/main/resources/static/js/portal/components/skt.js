export default () => {
  return `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid">
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
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">location_on</i>
              </div>
              <h4 class="card-title">SKT Datacenter</h4>
            </div>
            <div class="card-body ">
              <div id="map" style="width:100%;height:450px;"></div>
            </div><!-- card body end -->
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Region</h4>
            </div>
            <div class="card-body ">

              <div class="material-datatables">

                <div class="data-loading">
                  위 지도에서 데이터 센터를 선택하세요.
                </div>

                <table id="sktRegion" class="table table-striped table-no-bordered table-hover" cellspacing="0" width="100%" style="width:100%">
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </div>

            </div><!-- card body end -->
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Applications</h4>
            </div>
            <div class="card-body">

              <div class="material-datatables">

                <table id="sktApps" class="table table-striped table-no-bordered table-hover" cellspacing="0" width="100%" style="width:100%">
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </div>

            </div><!-- card body end -->
          </div>
        </div>
      </div>

    </div>
  </div>
`}
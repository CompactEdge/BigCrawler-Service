export default `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid">
      <div class="col-2">
        <div class="card sticky-card">
          <div class="card-body">
            <div class="input-group">

              <div class="col-md">
                <select class="selectpicker show-tick" data-width="100%" data-style="btn-primary">
                  <optgroup label="Namespace" data-max-options="1">
                    <option selected value="all">All namespaces</option>
                  </optgroup>
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>
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
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Storage</h4>
            </div>
            <div class="card-body ">

              <div class="material-datatables">

                <div class="data-loading">
                  <div class="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>

                <table id="rstorages" class="table table-striped table-no-bordered table-hover" cellspacing="0" width="100%" style="width:100%">
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
`;
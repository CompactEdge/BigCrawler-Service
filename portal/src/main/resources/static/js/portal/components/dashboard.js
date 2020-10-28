export default () => {
  return `
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
        <div class="col-xl-12">
          <div class="card card-chart">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">pie_chart</i>
              </div>
              <h4 class="card-title">Workload Status</h4>
            </div>

            <div id="chartColumn" class="card-body">
              <div class="row">
                <div class="col-xl-2">
                  <div class="chart-box pie-chart"></div>
                </div>
                <div class="col-xl-2">
                  <div class="chart-box pie-chart"></div>
                </div>
                <div class="col-xl-2">
                  <div class="chart-box pie-chart"></div>
                </div>
                <div class="col-xl-2">
                  <div class="chart-box pie-chart"></div>
                </div>
                <div class="col-xl-2">
                  <div class="chart-box pie-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="data-loading" style="display: none;">
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

        <div class="row" id="scrollToPod">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Pod</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">

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

                <table id="pods" class="table table-striped table-no-bordered table-hover" cellspacing="0" style="width:100%;">
                  <thead></thead>
                  <tbody></tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="row" id="scrollToDeployment">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Deployment</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">

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

                <table id="deployments" class="table table-striped table-no-bordered table-hover" cellspacing="0" style="width:100%;">
                  <thead></thead>
                  <tbody></tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="row" id="scrollToStatefulset">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Statefulset</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">

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

                <table id="statefulsets" class="table table-striped table-no-bordered table-hover" cellspacing="0" style="width:100%;">
                  <thead></thead>
                  <tbody></tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="row" id="scrollToDaemonset">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Daemonset</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">

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

                <table id="daemonsets" class="table table-striped table-no-bordered table-hover" cellspacing="0" style="width:100%;">
                  <thead></thead>
                  <tbody></tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="row" id="scrollToService">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">list</i>
              </div>
              <h4 class="card-title">Service</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">

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

                <table id="services" class="table table-striped table-no-bordered table-hover" cellspacing="0" style="width:100%;">
                  <thead></thead>
                  <tbody></tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`}
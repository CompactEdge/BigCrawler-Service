export default `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid">
      <div class="col-md-2">
        <div class="card sticky-card">
          <div class="card-body">
            <div class="input-group">

              <div class="col-md">
                <select class="selectpicker show-tick" data-width="100%" data-style="btn-rose">
                  <optgroup label="refresh" data-max-options="1">
                    <option value="off">Off</option>
                  </optgroup>
                  <option value="5">5s</option>
                  <option selected value="15">15s</option>
                  <option value="30">30s</option>
                  <option value="60">1m</option>
                  <option value="300">5m</option>
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
      <!-- Headlines start -->
      <div class="row cluster-headlines">
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">CPU Utilisation</p>
              <h4 class="card-title" id="head-1"></h4>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">CPU Requests Commitment</p>
              <h4 class="card-title" id="head-2"></h4>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">CPU Limits Commitment</p>
              <h4 class="card-title" id="head-3"></h4>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">Memory Utilisation</p>
              <h4 class="card-title" id="head-4"></h4>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">Memory Requests Commitment</p>
              <h4 class="card-title" id="head-5"></h4>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="card card-stats">
            <div class="card-header">
              <p class="card-category panel-header">Memory Limits Commitment</p>
              <h4 class="card-title" id="head-6"></h4>
            </div>
          </div>
        </div>
      </div>
      <!-- Headlines start -->

      <!-- CPU Usage start -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-success">
              <div class="card-icon">
                <i class="material-icons">multiline_chart</i>
              </div>
              <h4 class="card-title">CPU Usage</h4>
            </div>
            <div class="card-body ">
              <div class="row">
                <div class="col-md-12">
                  <div id="cpuUsage" class="chart-box line-chart">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CPU Usage end -->

      <!-- CPU Quota start -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-success">
              <div class="card-icon">
                <i class="material-icons">assignment</i>
              </div>
              <h4 class="card-title">CPU Quota</h4>
            </div>
            <div class="card-body">
              <div class="monitoring table-responsive">
                <table id="cpuQuota" class="table">
                  <thead class="text-dark">
                    <tr>
                      <th>Namespace</th>
                      <th>Pods</th>
                      <th>Workloads</th>
                      <th>CPU Usage</th>
                      <th>CPU Requests</th>
                      <th>CPU Requests %</th>
                      <th>CPU Limits</th>
                      <th>CPU Limits %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CPU Quota end -->

      <!-- Memory Usage start -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">multiline_chart</i>
              </div>
              <h4 class="card-title">Memory Usage (w/o cache)</h4>
            </div>
            <div class="card-body ">
              <div class="row">
                <div class="col-md-12">
                  <div id="memoryUsage" class="chart-box line-chart">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Memory Usage end -->

      <!-- Memory Requests start -->
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header card-header-icon card-header-info">
              <div class="card-icon">
                <i class="material-icons">assignment</i>
              </div>
              <h4 class="card-title">Memory Requests</h4>
            </div>
            <div class="card-body">
              <div class="monitoring table-responsive">
                <table id="memoryRequests" class="table">
                  <thead class="text-dark">
                    <tr>
                      <th>Namespace</th>
                      <th>Pods</th>
                      <th>Workloads</th>
                      <th>Memory Usage</th>
                      <th>Memory Requests</th>
                      <th>Memory Requests %</th>
                      <th>Memory Limits</th>
                      <th>Memory Limits %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Memory Requests end -->
    </div>
  </div>
`;
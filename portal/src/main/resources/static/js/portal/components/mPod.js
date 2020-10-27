export default `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-transparent sticky-top">
    <div class="navbar-form"></div>
    <div class="container-fluid">
      <div class="col-md-6">
        <div class="card sticky-card">
          <div class="card-body">
            <div class="input-group">

              <div class="col-md">
                <select class="selectpicker show-tick" data-width="100%" data-style="btn-primary">
                  <optgroup label="Namespace" data-max-options="1"></optgroup>
                </select>
              </div>

              <div class="col-md">
                <select class="selectpicker show-tick" data-width="100%" data-style="btn-primary">
                  <optgroup label="Pod" data-max-options="1"></optgroup>
                </select>
              </div>

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
                      <th>Container</th>
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
              <h4 class="card-title">Memory Quota</h4>
            </div>
            <div class="card-body">
              <div class="monitoring table-responsive">
                <table id="memoryQuota" class="table">
                  <thead class="text-dark">
                    <tr>
                      <th>Container</th>
                      <th>Memory Usage</th>
                      <th>Memory Requests</th>
                      <th>Memory Requests %</th>
                      <th>Memory Limits</th>
                      <th>Memory Limits %</th>
                      <th>Memory Usage(RSS)</th>
                      <th>Memory Usage(Cache)</th>
                      <th>Memory Usage(Swap)</th>
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
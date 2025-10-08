import { Component } from '@angular/core';
import { GridOptions, Module, themeQuartz } from 'ag-grid-enterprise';
import {
  AdaptableApi,
  AdaptableOptions,
  AdaptableStateFunctionConfig,
} from '@adaptabletools/adaptable-angular-aggrid';
import { rowData } from './rowData';
import { RECOMMENDED_MODULES } from './agGridModules';
import { columnDefs, defaultColDef } from './columnDefs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public agGridModules: Module[] = RECOMMENDED_MODULES;
  public adaptableApi: AdaptableApi;
  public gridOptions: GridOptions;

  public adaptableOptions: AdaptableOptions = {
    primaryKey: 'id',
    userName: 'demo-user',
    licenseKey: 'AppName=Qualcomm-Trial|Owner=Qualcomm|StartDate=2025-08-11|EndDate=2025-10-11|Ref=AdaptableLicense|Trial=true|TS=1754922426234|C=2884168023,2498975510,4261170317,1260976079,3963652368,345278543,1423722993,4121641380',
    adaptableId: 'AdapTable Angular App', // Typically you will store State remotely; here we simply leverage local storage for convenience
    stateOptions: {
      persistState: (state, adaptableStateFunctionConfig) => {
        localStorage.setItem(
          adaptableStateFunctionConfig.adaptableStateKey,
          JSON.stringify(state)
        );
        return Promise.resolve(true);
      },
      loadState: (config: AdaptableStateFunctionConfig) => {
        return new Promise((resolve) => {
          let state = {};
          try {
            state =
              JSON.parse(
                localStorage.getItem(config.adaptableStateKey) as string
              ) || {};
          } catch (err) {
            console.log('Error loading state', err);
          }
          resolve(state);
        });
      },
    },
    initialState: {
      Dashboard: {
        Tabs: [
          {
            Name: 'Default',
            Toolbars: ['Layout', 'Query', 'Export', 'Pivot'],
          },
        ],
      },
      Export: {},
      Layout: {
        CurrentLayout: 'Standard Layout',
        Layouts: [
          {
            Name: 'Standard Layout',
            TableColumns: [
              'name',
              'language',
              'github_stars',
              'license',
              'created_at',
              'has_wiki',
              'updated_at',
              'pushed_at',
              'github_watchers',
              'open_issues_count',
              'closed_issues_count',
              'open_pr_count',
              'closed_pr_count',
              'description',
              'has_projects',
              'has_pages',
              'week_issue_change',
            ],
          },
        ],
      },
      PivotState: {
        PivotLayouts: [
          {
            Name: 'Language Pivot',
            RowColumnIds: ['language'],
            ColumnColumnIds: ['has_wiki'],
            ValueColumnIds: ['github_stars'],
            CalculationMode: 'Sum',
            ShowRowTotals: true,
            ShowColumnTotals: true,
            ShowTotalsOnTop: false,
          },
          {
            Name: 'Stars by License',
            RowColumnIds: ['license'],
            ColumnColumnIds: [],
            ValueColumnIds: ['github_stars'],
            CalculationMode: 'Sum',
            ShowRowTotals: true,
            ShowColumnTotals: true,
            ShowTotalsOnTop: false,
          },
          {
            Name: 'Issues Analysis',
            RowColumnIds: ['language'],
            ColumnColumnIds: ['has_wiki'],
            ValueColumnIds: ['open_issues_count', 'closed_issues_count'],
            CalculationMode: 'Sum',
            ShowRowTotals: true,
            ShowColumnTotals: true,
            ShowTotalsOnTop: false,
          }
        ]
      },
    } as any,
  };

  constructor() {
    this.gridOptions = {
      theme: themeQuartz,
      defaultColDef,
      columnDefs,
      rowData,
    };
  }

  adaptableReady = ({ adaptableApi }) => {
    this.adaptableApi = adaptableApi;
    // use AdaptableApi for runtime access to Adaptable
  };
}

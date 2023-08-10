from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as rest_framework_views

from lsdb.views import ActionCompletionDefinitionViewSet
from lsdb.views import ActionDefinitionViewSet
from lsdb.views import ActionResultViewSet
from lsdb.views import ApiRequestLogViewSet
from lsdb.views import AssetCapacityViewSet
from lsdb.views import AssetTypeViewSet
from lsdb.views import AssetViewSet
from lsdb.views import AvailableDefectViewSet
from lsdb.views import AzureFileViewSet
from lsdb.views import ModulePropertyViewSet
from lsdb.views import ConditionDefinitionViewSet
from lsdb.views import CrateViewSet
from lsdb.views import CustomerViewSet
from lsdb.views import DispositionCodeViewSet
from lsdb.views import DispositionViewSet
from lsdb.views import ExpectedUnitTypeViewSet
from lsdb.views import FileFormatViewSet
from lsdb.views import ForgotPasswordViewSet
from lsdb.views import GroupTypeViewSet
from lsdb.views import GroupViewSet
from lsdb.views import LabelViewSet
from lsdb.views import LimitComparisonModeViewSet
from lsdb.views import LimitComparisonViewSet
from lsdb.views import LimitViewSet
from lsdb.views import LocationViewSet
from lsdb.views import ManageResultViewSet
from lsdb.views import MeasurementDefinitionViewSet
from lsdb.views import MeasurementResultTypeViewSet
from lsdb.views import MeasurementResultViewSet
from lsdb.views import MeasurementTypeViewSet
from lsdb.views import ModuleTechnologyViewSet
from lsdb.views import NoteViewSet
from lsdb.views import NoteTypeViewSet
from lsdb.views import NoopViewSet
from lsdb.views import OrganizationViewSet
# from lsdb.views import OutOfFamilyLimitViewSet
from lsdb.views import PermissionTypeViewSet
from lsdb.views import PermissionViewSet
from lsdb.views import PermittedViewViewSet
from lsdb.views import PluginViewSet
from lsdb.views import TestSequenceDefinitionViewSet
from lsdb.views import ProjectViewSet
from lsdb.views import PropertyViewSet
from lsdb.views import ProcedureDefinitionViewSet
from lsdb.views import ProcedureResultViewSet
from lsdb.views import SignInViewSet
from lsdb.views import SiPrefixViewSet
from lsdb.views import StepDefinitionViewSet
from lsdb.views import StepResultViewSet
from lsdb.views import StepTypeViewSet
from lsdb.views import TemplateViewSet
from lsdb.views import UnitTypeFamilyViewSet
from lsdb.views import UnitTypePropertyDataTypeViewSet
from lsdb.views import UnitTypePropertyResultViewSet
from lsdb.views import UnitTypePropertyTypeViewSet
from lsdb.views import UnitTypeViewSet
from lsdb.views import UnitViewSet
from lsdb.views import UserProfileViewSet
from lsdb.views import UserViewSet
from lsdb.views import UserRegistrationStatusViewSet
from lsdb.views import VisualizerViewSet
from lsdb.views import WorkOrderViewSet

router = DefaultRouter()
# router.register(r'action_completion_definitions', ApiRequestLogViewSet)
router.register(r'action_completion_definitions', ActionCompletionDefinitionViewSet)
router.register(r'action_definitions', ActionDefinitionViewSet)
router.register(r'action_results', ActionResultViewSet)
router.register(r'api_log', ApiRequestLogViewSet)
router.register(r'asset_capacities', AssetCapacityViewSet)
router.register(r'asset_types' , AssetTypeViewSet)
router.register(r'assets' , AssetViewSet)
router.register(r'available_defects' , AvailableDefectViewSet)
router.register(r'azure_files' , AzureFileViewSet)
router.register(r'module_properties' , ModulePropertyViewSet)
router.register(r'condition_definitions' , ConditionDefinitionViewSet)
router.register(r'crates' , CrateViewSet)
router.register(r'customers' , CustomerViewSet)
router.register(r'disposition_codes' , DispositionCodeViewSet)
router.register(r'dispositions' , DispositionViewSet)
router.register(r'expected_unit_types' , ExpectedUnitTypeViewSet)
router.register(r'file_formats', FileFormatViewSet)
router.register(r'forgot_password', ForgotPasswordViewSet)
router.register(r'group_types' , GroupTypeViewSet)
router.register(r'groups' , GroupViewSet)
router.register(r'labels' , LabelViewSet)
router.register(r'limit_comparison_modes' , LimitComparisonModeViewSet)
router.register(r'limit_comparisons' , LimitComparisonViewSet)
router.register(r'limits' , LimitViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'manage_results',ManageResultViewSet, basename='manageresults')
router.register(r'measurement_definitions' , MeasurementDefinitionViewSet)
router.register(r'measurement_result_types' , MeasurementResultTypeViewSet)
router.register(r'measurement_results' , MeasurementResultViewSet)
router.register(r'measurement_types' , MeasurementTypeViewSet)
router.register(r'module_technologies' , ModuleTechnologyViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'note_types', NoteTypeViewSet)
router.register(r'noop', NoopViewSet)
router.register(r'organizations' , OrganizationViewSet)
# router.register(r'out_of_family_limits', OutOfFamilyLimitViewSet)
router.register(r'plugins' , PluginViewSet)
router.register(r'permission_types' , PermissionTypeViewSet)
router.register(r'permissions' , PermissionViewSet)
router.register(r'permitted_views' , PermittedViewViewSet)
router.register(r'procedure_definitions' , ProcedureDefinitionViewSet)
router.register(r'procedure_results' , ProcedureResultViewSet)
router.register(r'projects' , ProjectViewSet)
router.register(r'properties' , PropertyViewSet)
router.register(r'si_prefixes' , SiPrefixViewSet)
router.register(r'signin', SignInViewSet)
router.register(r'step_definitions' , StepDefinitionViewSet)
router.register(r'step_results' , StepResultViewSet)
router.register(r'step_types' , StepTypeViewSet)
router.register(r'templates' , TemplateViewSet)
router.register(r'test_sequence_definitions' , TestSequenceDefinitionViewSet)
router.register(r'unit_type_families' , UnitTypeFamilyViewSet)
router.register(r'unit_type_property_data_types' , UnitTypePropertyDataTypeViewSet)
router.register(r'unit_type_property_results' , UnitTypePropertyResultViewSet)
router.register(r'unit_type_property_types' , UnitTypePropertyTypeViewSet)
router.register(r'unit_types' , UnitTypeViewSet)
router.register(r'units' , UnitViewSet)
router.register(r'user_profiles' , UserProfileViewSet)
router.register(r'users', UserViewSet)
router.register(r'user_registration_statuses' , UserRegistrationStatusViewSet)
router.register(r'visualizers' , VisualizerViewSet)
router.register(r'work_orders' , WorkOrderViewSet)

# app_name='lsdb'

urlpatterns =[
    # url(r'^admin/', include(admin.site.urls)),
    # url(r'^azure/', include('azure_ad_auth.urls')),
    # url(r'^login_successful/$', login_successful, name='login_successful'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]

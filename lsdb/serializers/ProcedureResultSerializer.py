import json
import magic
import pandas as pd

from rest_framework import serializers
from django.db.models import Q
from lsdb.models import ProcedureResult
from lsdb.models import MeasurementResult
from lsdb.serializers.StepResultSerializer import StepResultSerializer
from lsdb.serializers.StepResultSerializer import StepResultStressSerializer
from lsdb.serializers.UnitTypeSerializer import UnitTypeSerializer

# class IVCurveMeasurementSerializer(serializers.HyperlinkedModelSerializer):
#     ### DEPRECATED
#     # KLUGE: This opens and closes the same file twice. which is lame
#     color = serializers.SerializerMethodField()
#     chart = serializers.SerializerMethodField()
#     multiplier = serializers.SerializerMethodField()
#
#     def get_multiplier(self,obj):
#         # print('curve_mult')
#         if obj.result_files.all():
#             multiplier = 0
#             for file in obj.result_files.all():
#                 # print(file.file.name)
#                 file_handle = file.file.open('rb')
#                 if magic.from_buffer(file_handle.read(2048), mime=True) != 'text/plain':
#                     # It's binary, we can't eat that(mfr files show up as: application/x-wine-extension-ini)
#                     continue
#                 file_handle.seek(0)
#                 data_table = pd.read_csv(file_handle, sep='\t')
#                 # Check that this is a sinton or pasan text file
#                 if 'Vcorr' in data_table.columns:
#                     multiplier = float(int(data_table.iat[0,12]) / 1000)
#                     return multiplier
#                 elif 'Model_Voltage_(V)' in data_table.columns:
#                     # this is not the file we're looking for
#                     continue
#                 else:
#                     file_handle.seek(0)
#                     data_table = pd.read_csv(file_handle, sep='\t')
#                     # print(data_table.columns)
#                     if 'Power_per_Sun_(W/m2)' in data_table.columns:
#                         multiplier = data_table['Power_per_Sun_(W/m2)'][0] * data_table['Intensity_(suns)'][0] / 1000
#                 file_handle.close()
#             # print('MULT',multiplier)
#             return multiplier
#         else:
#             return({})
#
#     def get_color(self,obj): return "hsl(263, 70%, 50%)"
#
#     def get_chart(self, obj):
#         # print('files:',obj.id)
#         # KLUGE: This has zero exception handling
#         if obj.result_files.all():
#             # We have a file to work on:
#             foo = 0
#             for file in obj.result_files.all():
#                 # print(file.file.name)
#                 # need to detect file type here:
#                 file_handle = file.file.open('rb')
#                 if magic.from_buffer(file_handle.read(2048), mime=True) != 'text/plain':
#                     # It's binary, we can't eat that(mfr files show up as: application/x-wine-extension-ini)
#                     continue
#                 file_handle.seek(0)
#                 data_table = pd.read_csv(file_handle, sep='\t')
#                 file_handle.close()
#                 # Check that this is a sinton or pasan text file
#                 # print(data_table.columns)
#                 if 'Vcorr' in data_table.columns:
#                     # Pasan
#                     cols = data_table[['Vcorr','Icorr']]
#                 elif 'Model_Voltage_(V)' in data_table.columns:
#                     # Sinton
#                     cols = data_table[['Model_Voltage_(V)','Model_Current_(A)']]
#                 else:
#                     # None of the above:
#                     continue
#                 cols.columns= ['x', 'y']
#                 foo = cols.to_json(orient='records')
#             if foo:
#                 return (json.loads(foo))
#         # file measurement without files
#         return([])
#
#     class Meta:
#         model = MeasurementResult
#         fields = [
#             'id',
#             'color',
#             'multiplier',
#             'chart',
#         ]

class TransformIVCurveSerializer(serializers.HyperlinkedModelSerializer):
    # test_sequence_definition_name = serializers.ReadOnlyField(source='test_sequence_definition.name')
    procedure_definition_name = serializers.ReadOnlyField(source='procedure_definition.name')
    # disposition_name = serializers.SerializerMethodField()
    # visualizer = serializers.ReadOnlyField(source='procedure_definition.visualizer.name')
    unit_type = UnitTypeSerializer(source='unit.unit_type', many=False)
    flash_values = serializers.SerializerMethodField()
    iv_curves = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()
    # multiplier = serializers.SerializerMethodField()
    has_notes = serializers.SerializerMethodField()
    open_notes = serializers.SerializerMethodField()

    def get_has_notes(self, obj):
        if obj.notes.count() > 0:
            return True
        else:
            return False

    def get_open_notes(self, obj):
        if obj.notes.filter(Q(disposition__complete=False)|Q(disposition__isnull=True)).count() > 0:
            return True
        else:
            return False

    def get_multiplier(self, obj):
        # Stubbed deliberately --MD
        # print('in mult')
        # flash_measurements = MeasurementResult.objects.filter(
        #     step_result__in=obj.stepresult_set.all(),
        #     measurement_result_type__name__icontains='result_double'
        # )
        flash = {}
        # for measurement in flash_measurements:
        #     flash[measurement.name] = measurement.result_double
        return (flash)

    def get_flash_values(self, obj):
        # print('in flash')
        # TODO: This should suppress failing measurements
        flash_measurements = MeasurementResult.objects.filter(
            step_result__in=obj.stepresult_set.all(),
            measurement_result_type__name__icontains='result_double'
        )
        flash = {}
        for measurement in flash_measurements:
            flash[measurement.name] = measurement.result_double
        return (flash)

    def parse_flash(self, file):
        mult = None
        # print(file.file.name)
        file_handle = file.file.open('rb')
        if magic.from_buffer(file_handle.read(2048), mime=True) != 'text/plain':
            # It's binary, we can't eat that(mfr files show up as: application/x-wine-extension-ini)
            # print('binary')
            file_handle.close()
            return None,None,None
        file_handle.seek(0)
        # print('about to read')
        import traceback
        try:
            data_table = pd.read_csv(file_handle, sep='\t',encoding_errors='ignore')
            # maybe have a different seprator?
            if len(data_table.columns.array) <= 1:
                file_handle.seek(0)
                data_table = pd.read_csv(file_handle, sep=';',encoding_errors='ignore',skiprows=12)
            # print(data_table.columns)
        except Exception as err:
            print(Exception)
            print(err)
            traceback.print_tb(err.__traceback__)

        # print(data_table)
        # Check that this is a sinton or pasan text file
        if 'Vcorr' in data_table.columns:
            # pasan chart....
            mult = float(int(data_table.iat[0,12]) / 1000)
            # print('pasandata')
            cols = data_table[['Vcorr','Icorr']]
            filetype = 'pdata'
        elif 'Nr' in data_table.columns:
            # Looks like a HALM file, make it look like a PASAN file
            cols = data_table[['Ucor [[V]]','Icor [[A]]']]
            cols.columns = ['Vcorr','Icorr']
            filetype = 'pdata'
        elif 'Model_Voltage_(V)' in data_table.columns:
            # sinton data file
            # print('sinton data')
            cols = data_table[['Model_Voltage_(V)','Model_Current_(A)','Vload_(V)','ILoad_(A)']]
            filetype = 'sdata'
        else:
            # print('sinton params')
            if 'Power_per_Sun_(W/m2)' in data_table.columns:
                cols = data_table['Power_per_Sun_(W/m2)'][0] * data_table['Intensity_(suns)'][0] / 1000
                filetype = 'sparams'
        file_handle.close()
        return filetype, cols, mult

    def get_iv_curves(self, obj):
        measurements = MeasurementResult.objects.filter(
            step_result__in=obj.stepresult_set.all(),
            measurement_result_type__name__icontains='result_files',
            disposition__isnull=False
        ).exclude(
            disposition__name__icontains='fail'
        )
        iv_curves = []
        temp_curve = {} # split sinton holding dict
        # print('get_iv',measurements)
        # print('count',measurements.count())
        try:
            for measurement in measurements:
                # print(measurement.id)
                if measurement.result_files.all().count() == 1: # Pasan or split-sinton
                    curve_dict = {}
                    # print('have 1 measurement')
                    curve_dict['id'] = measurement.id
                    curve_dict['color'] = "hsl(263, 70%, 50%)"
                    curve_dict['multiplier'] = 0
                    # for file in measurement.result_files.all():
                    filetype, cols, mult = self.parse_flash(measurement.result_files.first())
                    # print('uno')
                    if filetype == 'sparams': # sinton params,
                        temp_curve['multiplier'] = cols
                        temp_curve['color'] = "hsl(263, 70%, 50%)"
                    if filetype == 'sdata': # sinton data,
                        temp_curve['id'] = measurement.id
                        curve_one = cols[['Model_Voltage_(V)','Model_Current_(A)']]
                        curve_two = cols[['Vload_(V)','ILoad_(A)']]
                        curve_one.columns = ['x', 'y']
                        curve_two.columns = ['x', 'y']
                        temp_curve['curve_one']= json.loads(curve_one.to_json(orient='records'))
                        temp_curve['curve_two']= json.loads(curve_two.to_json(orient='records'))
                    if filetype == 'pdata': # pasan data,
                        cols.columns= ['x', 'y']
                        json_points = cols.to_json(orient='records')
                        curve_dict['multiplier'] = mult
                        curve_dict['chart'] = json.loads(json_points)
                        iv_curves.append(curve_dict)

                elif measurement.result_files.all().count() >1: # multi-file, probably sinton
                    curve_dict = {}
                    curve_dict['id'] = measurement.id
                    curve_dict['color'] = "hsl(263, 70%, 50%)"
                    curve_dict['multiplier'] = 0
                    # print('ganged sinton')
                    for file in measurement.result_files.all():
                        filetype, data, mult = self.parse_flash(file)
                        if filetype == None:
                            # that was binary, ignore it.
                            continue
                        if filetype == 'sparams': # sinton params,
                            curve_dict['multiplier'] = data
                            curve_dict['color'] = "hsl(263, 70%, 50%)"
                        if filetype == 'sdata': # sinton data,
                            cols = data
                    # done parsing files
                    if 'Model_Voltage_(V)' in cols.columns:
                        # sinton - multi
                        bonus_dict = {}
                        bonus_dict['id'] = '{}-A'.format(measurement.id)
                        bonus_dict['color'] = "hsl(263, 70%, 50%)"
                        bonus_dict['multiplier'] = curve_dict['multiplier']

                        curve_one = cols[['Model_Voltage_(V)','Model_Current_(A)']]
                        curve_two = cols[['Vload_(V)','ILoad_(A)']]
                        curve_one.columns = ['x', 'y']
                        curve_two.columns = ['x', 'y']

                        curve_dict['chart'] = json.loads(curve_one.to_json(orient='records'))
                        bonus_dict['chart'] = json.loads(curve_two.to_json(orient='records'))

                        iv_curves.append(curve_dict)
                        iv_curves.append(bonus_dict)

            # Pasan cases hould be done, but if we get here and iv_curves is empty we need sinton:
            if not len(iv_curves):
                # print('unsplitting sinton!')
                curve_dict = {}
                bonus_dict = {}

                curve_dict['id'] = '{}'.format(measurement.id)
                bonus_dict['id'] = '{}-A'.format(measurement.id)

                curve_dict['color'] = temp_curve['color']
                bonus_dict['color'] = temp_curve['color']

                curve_dict['multiplier'] = temp_curve['multiplier']
                bonus_dict['multiplier'] = temp_curve['multiplier']

                curve_dict['chart'] = temp_curve['curve_one']
                bonus_dict['chart'] = temp_curve['curve_two']

                iv_curves.append(curve_dict)
                iv_curves.append(bonus_dict)
            # print('curves:',iv_curves)
        except:
            # Something failed and we need a fake result, probably "no files"
            measurements = MeasurementResult.objects.filter(
                step_result__in=obj.stepresult_set.all(),
                name__icontains='irradiance',
                disposition__isnull=False
            ).exclude(
                disposition__name__icontains='fail'
            )
            if len(measurements):
                measurement = measurements.first()
                iv_curves.append(
                    {
                        'id':measurement.id,
                        'multiplier':getattr(measurement, measurement.measurement_result_type.name)/1000,
                        "color": "hsl(263, 70%, 50%)",
                        "chart":[{
                            "x": 0,
                            "y": 0
                            }]
                    }
                )
            else:
                # Completely fake:
                iv_curves.append(
                    {
                        'id':0,
                        'multiplier':1,
                        "color": "hsl(263, 70%, 50%)",
                        "chart":[{
                            "x": 0,
                            "y": 0
                            }]
                    }
                )
            pass
        return iv_curves

    def get_disposition_name(self, obj):
        # print('in disp')
        if obj.disposition:
            return obj.disposition.name
        else:
            return None

    def get_assets(self, obj):
        measurements = MeasurementResult.objects.filter(
            step_result__in = obj.stepresult_set.all(),
            disposition__isnull = False,
        ).distinct().values_list('asset__name')
        assets = set(measurements)
        return assets

    class Meta:
        model = ProcedureResult
        fields = [
            'id',
            'url',
            'unit',
            'procedure_definition_name',
            'disposition',
            'name',
            'unit_type',
            'flash_values',
            'iv_curves',
            'assets',
            'has_notes',
            'open_notes'
        ]

class ProcedureResultSerializer(serializers.HyperlinkedModelSerializer):
    step_results = StepResultSerializer(source='stepresult_set', many=True, read_only=True)
    work_order_name = serializers.ReadOnlyField(source='work_order.name')
    customer_name = serializers.ReadOnlyField(source='work_order.project.customer.name')
    project_number = serializers.ReadOnlyField(source='work_order.project.number')
    test_sequence_definition_name = serializers.ReadOnlyField(source='test_sequence_definition.name')
    procedure_definition_name = serializers.ReadOnlyField(source='procedure_definition.name')
    disposition_name = serializers.SerializerMethodField()
    visualizer = serializers.ReadOnlyField(source='procedure_definition.visualizer.name')
    assets = serializers.SerializerMethodField()
    has_notes = serializers.SerializerMethodField()
    open_notes = serializers.SerializerMethodField()

    def get_has_notes(self, obj):
        if obj.notes.count() > 0:
            return True
        else:
            return False

    def get_open_notes(self, obj):
        if obj.notes.filter(Q(disposition__complete=False)|Q(disposition__isnull=True)).count() > 0:
            return True
        else:
            return False

    def get_disposition_name(self, obj):
        if obj.disposition:
            return obj.disposition.name
        else:
            return None

    def get_assets(self, obj):
        measurements = MeasurementResult.objects.filter(
            step_result__in=obj.stepresult_set.all(),
            disposition__isnull = False,
        ).distinct().values_list('asset__name')
        assets = set(measurements)
        return assets


    class Meta:
        model = ProcedureResult
        fields = [
            'id',
            'url',
            'unit',
            'procedure_definition',
            'procedure_definition_name',
            'disposition',
            'disposition_name',
            'start_datetime',
            'end_datetime',
            'customer_name',
            'project_number',
            'work_order',
            'work_order_name',
            'linear_execution_group',
            'name',
            'work_in_progress_must_comply',
            'group',
            'supersede',
            'version',
            'test_sequence_definition',
            'test_sequence_definition_name',
            'allow_skip',
            'step_results',
            'visualizer',
            'assets',
            'has_notes',
            'open_notes'
        ]

class ProcedureResultStressSerializer(serializers.HyperlinkedModelSerializer):
    step_results = StepResultStressSerializer(source='stepresult_set', many=True, read_only=True)
    work_order_name = serializers.ReadOnlyField(source='work_order.name')
    customer_name = serializers.ReadOnlyField(source='work_order.project.customer.name')
    project_number = serializers.ReadOnlyField(source='work_order.project.number')
    test_sequence_definition_name = serializers.ReadOnlyField(source='test_sequence_definition.name')
    procedure_definition_name = serializers.ReadOnlyField(source='procedure_definition.name')
    disposition_name = serializers.SerializerMethodField()
    visualizer = serializers.ReadOnlyField(source='procedure_definition.visualizer.name')
    assets = serializers.SerializerMethodField()
    has_notes = serializers.SerializerMethodField()
    open_notes = serializers.SerializerMethodField()

    def get_has_notes(self, obj):
        if obj.notes.count() > 0:
            return True
        else:
            return False

    def get_open_notes(self, obj):
        if obj.notes.filter(Q(disposition__complete=False)|Q(disposition__isnull=True)).count() > 0:
            return True
        else:
            return False

    def get_disposition_name(self, obj):
        if obj.disposition:
            return obj.disposition.name
        else:
            return None

    def get_assets(self, obj):
        measurements = MeasurementResult.objects.filter(
            step_result__in=obj.stepresult_set.all(),
            disposition__isnull = False,
        ).distinct().values_list('asset__name')
        assets = set(measurements)
        return assets

    class Meta:
        model = ProcedureResult
        fields = [
            'id',
            'url',
            'unit',
            'procedure_definition',
            'procedure_definition_name',
            'disposition',
            'disposition_name',
            'start_datetime',
            'end_datetime',
            'customer_name',
            'project_number',
            'work_order',
            'work_order_name',
            'linear_execution_group',
            'name',
            'work_in_progress_must_comply',
            'group',
            'supersede',
            'version',
            'test_sequence_definition',
            'test_sequence_definition_name',
            'allow_skip',
            'step_results',
            'visualizer',
            'assets',
            'has_notes',
            'open_notes'
        ]

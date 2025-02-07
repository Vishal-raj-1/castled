package io.castled.apps.syncconfigs;

import io.castled.OptionsReferences;
import io.castled.apps.models.GenericSyncObject;
import io.castled.commons.models.AppSyncMode;
import io.castled.forms.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@GroupActivator(dependencies = {"object"}, group = MappingFormGroups.SYNC_MODE)
public class GenericObjectRadioGroupConfig extends AppSyncConfig {

    @FormField(title = "Select object to configure", type = FormFieldType.RADIO_GROUP, group = MappingFormGroups.OBJECT, optionsRef = @OptionsRef(value = OptionsReferences.OBJECT, type = OptionsRefType.DYNAMIC))
    private GenericSyncObject object;

    @FormField(type = FormFieldType.RADIO_GROUP, title = "Sync Mode", description = "Sync mode which controls whether records will be appended, updated or upserted", group = MappingFormGroups.SYNC_MODE,
            optionsRef = @OptionsRef(value = OptionsReferences.SYNC_MODE, type = OptionsRefType.DYNAMIC))
    private AppSyncMode mode;
}